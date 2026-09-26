/**
 * 社内トレカの投稿用 Google フォームを自動で作る Apps Script。
 *
 * 使い方(1回だけ):
 *   1. https://script.google.com/ で「新しいプロジェクト」を作り、このファイルの中身を全部貼り付けて保存
 *   2. 上の関数の選択欄で createCardForms を選んで「実行」→ Google アカウントの権限を許可
 *   3. 実行ログに出る「カード投稿フォーム」のURLを社内に共有する
 *
 * 作られるもの:
 *   - カード投稿フォーム(カード種類を選ぶと、モンスター / 魔法 / 罠 それぞれの質問に分かれる)
 *   - 世界観メモ投稿フォーム(社内用語・人物・出来事)
 *   - 回答が集まるスプレッドシート(シート名「カード回答」「世界観メモ回答」)
 *
 * 質問のタイトルは社内トレカメーカーが読み込むときの列名なので、変えないでください(説明文は自由に変えてOK)。
 */

var TITLE = 'ウィーブレイン トレカ';

var MONSTER_TYPES = ['効果モンスター', '通常モンスター', '融合モンスター', '儀式モンスター', 'シンクロモンスター', 'エクシーズモンスター'];
var SPELL_TYPES = ['通常', '永続', '装備', '速攻', 'フィールド', '儀式'];
var TRAP_TYPES = ['通常', '永続', 'カウンター'];
var TONES = ['かっこよく', '面白く', 'かわいく', '渋く'];
var ATTRIBUTES = ['おまかせ', '光', '闇', '炎', '水', '風', '地', '神'];
var LIGHTS = ['おまかせ', '黄金の光', '紫の魔力', '蒼い光', '紅蓮の炎', '翠の風', 'なし'];
var WORLD_KINDS = ['人物', '社内用語', '出来事', '案件・商品', '場所', 'その他'];
var AI_NOTE = '空欄ならAIが考えます。';

function createCardForms() {
  var ss = SpreadsheetApp.create(TITLE + ' 回答');
  var cardForm = createCardForm_();
  var worldForm = createWorldForm_();

  cardForm.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  worldForm.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();
  Utilities.sleep(2000);

  // 回答シートの名前をそろえる(社内トレカメーカーがこの名前で読み込む)
  ss = SpreadsheetApp.openById(ss.getId());
  ss.getSheets().forEach(function (sheet) {
    var url = sheet.getFormUrl() || '';
    if (url.indexOf(cardForm.getId()) >= 0) sheet.setName('カード回答');
    else if (url.indexOf(worldForm.getId()) >= 0) sheet.setName('世界観メモ回答');
  });
  // 最初からある空のシートは消す
  ss.getSheets().forEach(function (sheet) {
    if (!sheet.getFormUrl() && ss.getSheets().length > 1 && sheet.getLastRow() === 0) ss.deleteSheet(sheet);
  });

  Logger.log('カード投稿フォーム(回答用URL): ' + cardForm.getPublishedUrl());
  Logger.log('カード投稿フォーム(編集用URL): ' + cardForm.getEditUrl());
  Logger.log('世界観メモ投稿フォーム(回答用URL): ' + worldForm.getPublishedUrl());
  Logger.log('回答スプレッドシート: ' + ss.getUrl());
}

function createCardForm_() {
  var form = FormApp.create(TITLE + ' カード投稿フォーム');
  form
    .setDescription(
      'ウィーブレインの社内トレカ(遊戯王風)のネタを募集しています。\n' +
        '人(同僚・自分)はモンスター、社内用語や決め台詞・イベントは魔法、相手を止める出来事は罠カードに向いています。\n' +
        '必須は「カード種類」と「元ネタ」だけ。書かなかった項目はAIが考えてカードにします。'
    )
    .setProgressBar(true)
    .setConfirmationMessage('投稿ありがとうございます！ カードの完成をお楽しみに。続けて別のカードも投稿できます。')
    .setAllowResponseEdits(false)
    .setCollectEmail(false);

  // ---- セクション1: カード種類 ----
  text_(form, '投稿者', 'あなたの名前(カードには載りません)', true);
  var typeItem = form
    .addMultipleChoiceItem()
    .setTitle('カード種類')
    .setHelpText('モンスター: 人(社員・コンビ・チーム)/ 魔法: 社内用語・決め台詞・道具・イベント / 罠: 相手を止める・跳ね返す出来事')
    .setRequired(true);

  // ---- セクション2: モンスター ----
  var monsterPage = form.addPageBreakItem().setTitle('モンスターカード').setHelpText('モデルになる人について教えてください。');
  text_(form, '元ネタ', 'モデルになる人の呼び名(例: スズキ)。コンビやチームならその名前', true);
  text_(form, '部署', '例: 管理本部', false);
  text_(form, '役職・担当', '例: CFO', false);
  para_(form, '特徴・得意なこと', '仕事ぶり・強み・見た目の特徴など');
  para_(form, '口癖・名ゼリフ', '例:「それ、契約書に書いてあります?」');
  para_(form, 'エピソード', '社内で有名な話・事件・評判');
  text_(form, '一緒に登場させたい人・モノ', '効果に出したい同僚・案件・他のカード名。例:「法務確認」「グレー金融」', false);
  choice_(form, '雰囲気', '', TONES);
  text_(form, 'カード名', AI_NOTE + '例: 財務統括魔導士スズキ(二つ名＋呼び名)', false);
  choice_(form, '属性', AI_NOTE, ATTRIBUTES);
  form
    .addListItem()
    .setTitle('レベル')
    .setHelpText(AI_NOTE + '星の数(社歴や役職の重さ)')
    .setChoiceValues(['おまかせ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
  text_(form, '種族', AI_NOTE + '例: CFO族', false);
  para_(form, '効果テキスト', AI_NOTE + '遊戯王風に書く場合は「①：〜」で始めると字下げされます');
  number_(form, 'ATK', AI_NOTE + '攻撃力 0〜5000');
  number_(form, 'DEF', AI_NOTE + '守備力 0〜5000');

  // ---- セクション3: 魔法 ----
  var spellPage = form.addPageBreakItem().setTitle('魔法カード').setHelpText('社内用語・決め台詞・道具・イベントなどを魔法カードにします。');
  choice_(
    form,
    '魔法・罠の種類',
    '通常: 1回きり / 永続: 場に残り続ける / 装備: モンスター(人)に付ける道具 / 速攻: 相手の番でも使える / フィールド: 場所・環境 / 儀式: 儀式モンスターを呼ぶ',
    SPELL_TYPES
  );
  text_(form, '元ネタ', '社内用語・決め台詞・道具・イベントなど(例: 月末締め、法務確認)', true);
  para_(form, '特徴・得意なこと', 'それが何か、どんな場面で出てくるか');
  para_(form, 'エピソード', 'まつわる話');
  text_(form, '一緒に登場させたい人・モノ', '効果に出したい人・他のカード名', false);
  choice_(form, '雰囲気', '', TONES);
  text_(form, 'カード名', AI_NOTE + '元ネタそのままでもOK', false);
  para_(form, '効果テキスト', AI_NOTE);

  // ---- セクション4: 罠 ----
  var trapPage = form.addPageBreakItem().setTitle('罠カード').setHelpText('相手を止める・跳ね返す出来事を罠カードにします。');
  choice_(form, '魔法・罠の種類', '通常: 1回きり / 永続: 場に残り続ける / カウンター: 相手の行動を無効にする', TRAP_TYPES);
  text_(form, '元ネタ', '出来事・決め台詞など(例: 稟議差し戻し、リターン請求)', true);
  para_(form, '特徴・得意なこと', 'それが何か、どんな場面で起きるか');
  para_(form, 'エピソード', 'まつわる話');
  text_(form, '一緒に登場させたい人・モノ', '効果に出したい人・他のカード名', false);
  choice_(form, '雰囲気', '', TONES);
  text_(form, 'カード名', AI_NOTE + '元ネタそのままでもOK', false);
  para_(form, '効果テキスト', AI_NOTE);

  // ---- セクション5: 最後に ----
  var finalPage = form.addPageBreakItem().setTitle('最後に');
  choice_(form, 'イラストの光', 'イラストに重ねる光のエフェクト', LIGHTS);
  para_(form, 'メモ', '運営へのメモ(イラストに使ってほしい写真がある場合の連絡など)');

  // カード種類の選択 → 各セクションへ。モンスター・魔法のセクションが終わったら「最後に」へ飛ぶ
  var choices = MONSTER_TYPES.map(function (t) {
    return typeItem.createChoice(t, monsterPage);
  });
  choices.push(typeItem.createChoice('魔法カード', spellPage));
  choices.push(typeItem.createChoice('罠カード', trapPage));
  typeItem.setChoices(choices);
  spellPage.setGoToPage(finalPage); // モンスターのセクションの次
  trapPage.setGoToPage(finalPage); // 魔法のセクションの次

  return form;
}

function createWorldForm_() {
  var form = FormApp.create(TITLE + ' 世界観メモ投稿フォーム');
  form
    .setDescription(
      'カードの効果に登場させたい社内用語・人物・出来事を教えてください。\n' +
        'ここに集まった用語は、すべてのカードの文面づくりに使われます(例: グレー金融、法務確認、テスラ)。'
    )
    .setConfirmationMessage('ありがとうございます！ 続けて別の用語も投稿できます。')
    .setCollectEmail(false);
  text_(form, '用語', '例: グレー金融', true);
  choice_(form, '種類', '', WORLD_KINDS);
  form.addParagraphTextItem().setTitle('説明').setHelpText('どんなものか、社内でどう使われているか').setRequired(true);
  text_(form, '投稿者', 'あなたの名前', false);
  return form;
}

// ---- 小物 ----

function text_(form, title, help, required) {
  return form.addTextItem().setTitle(title).setHelpText(help || '').setRequired(!!required);
}

function para_(form, title, help) {
  return form.addParagraphTextItem().setTitle(title).setHelpText(help || '');
}

function choice_(form, title, help, values) {
  return form.addMultipleChoiceItem().setTitle(title).setHelpText(help || '').setChoiceValues(values);
}

function number_(form, title, help) {
  var validation = FormApp.createTextValidation().setHelpText('0〜9999の数字で入力してください').requireNumberBetween(0, 9999).build();
  return form.addTextItem().setTitle(title).setHelpText(help || '').setValidation(validation);
}
