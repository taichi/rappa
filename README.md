
# for build
npm install handlebars -g
npm install lodash -g
lodash csp



# BUG
スクロール出来ない画面ではブラーが解けない。

# TODO

テストコード

現在ディレクトリの強調

チェックボックスをONにした時に何が起こるのか詳細説明

設定変更に併せてブラーを解除する為に、Portベースのメッセージパッシングにする。



リポジトリのルート・ディレクトリを見て、GitHubのdescriptionに色々情報を足す。
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

css の less化
  今はそれ程量が多い訳でもないので後回し。

ビルドスクリプト

# Aptana Studio 3
Angular.js のカスタム属性に関するワーニングを消す方法。
    Preferences > Studio >Validation > HTML and turned off "HTML Tidy" on 