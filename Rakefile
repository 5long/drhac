require 'yaml'

conf = YAML.load_file 'meta.yml'
src_dir = conf['src_dir']

task :help do
end

task :default => [:help] do
end

task :build => [:build_logo] do
end

task :clean do
  logos = conf['logo']
  logos.each do |item|
    File.unlink "#{src_dir}/#{item['out']}"
  end
end

task :load do
  chrome = conf['chrome_bin']
  sh chrome, "--load-extension=#{src_dir}"
end

desc 'Run all the tests/specified test in Chrome. An HTTP Server is needed'
task :test, :name do |t, args|
  args.with_defaults :name => '*'
  chrome = conf['chrome_bin']
  http_root = conf['http_root']
  tests = FileList["test/#{args.name}.html"].collect {|f| http_root + f}
  sh chrome, *tests
end

desc 'Using ImageMagick and optipng'
task :build_logo do
  img_convert = conf['img_convert_bin']
  img_crush = conf['img_crush_bin']
  logos = conf['logo']
  logos.each do |item|
    sh img_convert, "#{src_dir}/#{item['src']}", "#{src_dir}/#{item['out']}"
    sh img_crush, "#{src_dir}/#{item['out']}"
  end
end

desc 'Generate HTML file to run the test of a class'
task :gentest, :filename do |t, args|
  file = {:js => "#{args.filename}.js", :html => "#{args.filename}.html"}
  exit if File.exists? "test/#{file[:html]}"

  test_template = <<EOF
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Tests on #{args.filename}</title>

  <!-- Source code -->
  <script src="../src/js/#{file[:js]}" type="text/javascript"></script>
  <script src="../src/js/ijl.js" type="text/javascript"></script>
  
  
  <!-- Testing Frameworks -->
  <script src="lib/qunit/qunit.js" type="text/javascript"></script>
  <link rel="stylesheet" href="lib/qunit/qunit.css" type="text/css" media="screen" />
  <script src="lib/sime.js" type="text/javascript"></script>
  
  <!-- Test suits -->
  <script src="#{file[:js]}" type="text/javascript"></script>
  
</head>
<body>
  <h1 id="qunit-header">Test-all</h1>
  <h2 id="qunit-banner"></h2>
  <div id="qunit-testrunner-toolbar"> </div>
  <ol id="qunit-tests"></ol>

</body>
</html>
EOF
  File.open "test/#{file[:html]}", 'w' do |file|
    file.puts test_template
  end
  File.open "test/#{file[:js]}", "w" if not File.exists? "test/#{file[:js]}"
end


