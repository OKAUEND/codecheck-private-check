# Population Trends ver React

都道府県別の人口推移グラフ

## 概要

選択した都道府県の、1960 年から 2045 年まで年代毎の人口推移をグラフで表示し、
総人口の他に「年少人口」「生産年齢人口」「老年人口」などで切り替えてグラフ表示します。

## 始め方

### Step.1 : 依存パッケージのインストール

```
yarn install
```

### Step.2 : API Key の設定

RESAS API より API Key を発行してください。  
[RESAS API](https://opendata.resas-portal.go.jp/)

### Step.3 : Env ファイルへ API Key を設定

`.env`を作成し、`Step.2`で発光した API Key で環境変数を作成します。

```
VITE_RESAS_API_KEY=" You API Key "
```

## 開発コマンド

### ビルド

```
yarn Build
```

### 開発環境起動

```
yarn dev
```

### テスト実行

```
yarn test
```

### カバレッジ

```
yarn cove
```

### コードチェック(ESLint)

```
yarn check
```

### Lint 実行(ESLint)

```
yarn frmt
```
