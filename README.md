# Rappa
これはコードリーディング技術を得る為の矯正ギブスとなるChrome拡張です。  

![Screen Shot](https://github.com/taichi/rappa/raw/master/docs/screenshot.png)

# install

[Rappa on Chrome WebStore](https://chrome.google.com/webstore/detail/rappa/fmdbfhcpmkefkijjoogaiaigdgkmccpo)

- if you want to be Ninja
    - Option -> `Ninja reading training Mode` on and push `Apply`

# for build
- `npm install`
- `npm install grunt-cli -g`
- `npm install karma -g`
- `npm install handlebars -g`

## run tests
- `grunt test`

## memo
- npm install lodash -g
- lodash mobile -m -o extension/common/lodash.custom.min.js

# Development Environment
- [Aptana](http://www.aptana.com/)
- [EGit](http://www.eclipse.org/egit/download/)
- [JsHint eclipse](http://github.eclipsesource.com/jshint-eclipse/install.html)
- Chrome 24
- Node 0.8.14

# BUG
スクロール出来ない画面ではブラーが解けない。

# TODO

- chrome.extension.getBackgroundPage を chrome.runtime.getBackgroundPage に変える。

- リリース作業

- テストコード
    - contentScript

- 現在ディレクトリの強調

- チェックボックスをONにした時に何が起こるのか詳細説明

- 設定変更に併せてブラーを解除する為に、Portベースのメッセージパッシングにする。

- Google Analytics を使って設定変更をトラッキングする。
    - トレーニングモードの稼働率
    - 人気のリポジトリ

- css の less化
    - 今はそれ程量が多い訳でもないので後回し。


## リポジトリのルート・ディレクトリを見て、GitHubのdescriptionに色々情報を足す。
- プログラミング言語へのリファレンス、厳密にはそうでないものも出来るだけだす。
    - 言語系  js java ruby python perl erlang haskell
    - DSL系 css less sass 
    - テンプレート系 jsp handlebars jinja2 php markdown reST
- 依存ライブラリ一覧
      js以外のモノはサーバを用意して処理結果を返す方が良いかもしれない。正規表現を駆使してパースしても良い…かな…
      一部のフレームワークは例外的な扱いをしても良さそう。
    - http://efcl.info/2012/1209/res3166/
    - package.json
        - https://npmjs.org/
    - build.gradle
    - pom.xml
        - http://mvnrepository.com/
    - Gemfile
        - http://rubygems.org/
        - https://github.com/laserlemon/gemnasium-parser
    - setup.py
        - http://pypi.python.org/pypi
    - Scons
    - Waf
    - ...
- ビルドツールのマニュアルへのリンク
    - make
    - ant
    - grunt
    - buildout
    - ...
- 開発環境の類推
    - emacs
    - vim
    - eclipse
    - SublimeText2
    - ...

## 問題集リポジトリ
- よいコードと悪いコードが端的に分る様なコードリポジトリを用意する。
    - [悪いコードの例](https://github.com/taichi/rappa/blob/master/extension/content/js/repo_tree.js)
    - [良いコードの例](https://github.com/taichi/rappa/blob/master/extension/options/js/controllers.js)
- 何らかのソーシャルグラフによってそういうものが自動的に形成されるのが望ましいが…

## Aptana Studio 3
Angular.js のカスタム属性に関するワーニングを消す方法。

    Preferences > Studio >Validation > HTML and turned off "HTML Tidy" on 
