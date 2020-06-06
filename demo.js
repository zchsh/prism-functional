const prism = require("./lib/prism");
const grammar_bash = require("./languages/bash");
const grammar_ebnf = require("./languages/ebnf");
const grammar_go = require("./languages/go");
const grammar_hcl = require("./languages/hcl");
const grammar_javascript = require("./languages/javascript");
const grammar_sentinel = require("./languages/sentinel");
const grammar_shell_session = require("./languages/shell-session");

const grammarDict = {
  bash: grammar_bash,
  ebnf: grammar_ebnf,
  go: grammar_go,
  hcl: grammar_hcl,
  js: grammar_javascript,
  sentinel: grammar_sentinel,
  "shell-session": grammar_shell_session,
};

const grammarAliases = {
  shell: "bash",
};

const samples = [
  {
    language: "hcl",
    code:
      'resource "digitalocean_droplet" "web" {\n  name   = "tf-web"\n  size   = "512mb"\n  image  = "centos-5-8-x32"\n  region = "sfo1"\n}\n\nresource "dnsimple_record" "hello" {\n  domain = "example.com"\n  name   = "test"\n  value  = "${digitalocean_droplet.web.ipv4_address}"\n  type   = "A"\n}',
  },
  {
    language: "bash",
    code:
      '#!/bin/bash\n\n###### CONFIG\nACCEPTED_HOSTS="/root/.hag_accepted.conf"\nBE_VERBOSE=false\n\nif [ "$UID" -ne 0 ]\nthen\n echo "Superuser rights required"\n exit 2\nfi\n\ngenApacheConf(){\n echo -e "# Host ${HOME_DIR}$1/$2 :"\n}\n\necho \'"quoted"\' | tr -d " > text.txt',
  },
  {
    language: "shell",
    code:
      '#!/bin/bash\n\n###### CONFIG\nACCEPTED_HOSTS="/root/.hag_accepted.conf"\nBE_VERBOSE=false\n\nif [ "$UID" -ne 0 ]\nthen\n echo "Superuser rights required"\n exit 2\nfi\n\ngenApacheConf(){\n echo -e "# Host ${HOME_DIR}$1/$2 :"\n}\n\necho \'"quoted"\' | tr -d " > text.txt',
  },
  {
    language: "ebnf",
    code:
      '(* a simple program syntax in EBNF − Wikipedia *)\nprogram = \'PROGRAM\', white_space, identifier, white_space, \n           \'BEGIN\', white_space, \n           { assignment, ";", white_space }, \n           \'END.\' ;\nidentifier = alphabetic_character, { alphabetic_character | digit } ;\nnumber = [ "-" ], digit, { digit } ;\nstring = \'"\' , { all_characters - \'"\' }, \'"\' ;\nassignment = identifier , ":=" , ( number | identifier | string ) ;\nalphabetic_character = "A" | "B" | "C" | "D" | "E" | "F" | "G"\n                     | "H" | "I" | "J" | "K" | "L" | "M" | "N"\n                     | "O" | "P" | "Q" | "R" | "S" | "T" | "U"\n                     | "V" | "W" | "X" | "Y" | "Z" ;\ndigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;\nwhite_space = ? white_space characters ? ;\nall_characters = ? all visible characters ? ;',
  },
  {
    language: "shell-session",
    code: `$ go run hello-world.go\nhello world\n$ echo "hello world"\nhello world`,
  },
  {
    language: "js",
    code: `console.log("Hello world!")`,
  },
  {
    language: "go",
    code:
      'package main\n\nimport "fmt"\n\nfunc main() {\n    ch := make(chan float64)\n    ch <- 1.0e10    // magic number\n    x, ok := <- ch\n    defer fmt.Println(`exitting now`)\n    go println(len("hello world!"))\n    return\n}',
  },
  {
    language: "sentinel",
    code:
      'import "tfplan"\n# Get an array of all resources of the given type (or an empty array).\nget_resources = func(type) {\n  if length(tfplan.module_paths else []) > 0 { # always true in the real tfplan import\n    return get_resources_all_modules(type)\n  } else { # fallback for tests\n    return get_resources_root_only(type)\n  }\n}\nget_resources_root_only = func(type) {\n  resources = []\n  named_and_counted_resources = tfplan.resources[type] else {}\n  # Get resource bodies out of nested resource maps, from:\n  # {"name": {"0": {"applied": {...}, "diff": {...} }, "1": {...}}, "name": {...}}\n  # to:\n  # [{"applied": {...}, "diff": {...}}, {"applied": {...}, "diff": {...}}, ...]\n  for named_and_counted_resources as _, instances {\n    for instances as _, body {\n      append(resources, body)\n    }\n  }\n}',
  },
];

samples.forEach((sample) => {
  const { code, language } = sample;
  const grammarKey = grammarAliases[language] || language;
  sample.highlighted = prism(code, grammarDict[grammarKey]);
  console.log(sample.highlighted);
});
