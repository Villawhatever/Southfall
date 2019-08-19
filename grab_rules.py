import json
import re

rules_json = []
examples_json = []

with open("cr.txt", 'r', encoding='utf-8') as comp_rules:
    comp_rules = comp_rules.read()

    comp_rules = comp_rules.replace("“", "\"")
    comp_rules = comp_rules.replace("”", "\"")
    comp_rules = comp_rules.replace("’", "'")
    comp_rules = comp_rules.replace("‘", "'")
    comp_rules = comp_rules.replace("—", "-")
    comp_rules = re.sub(r"(\w)–—(\w)", r"\1—\2", comp_rules)
    comp_rules = comp_rules.replace("(tm)", "™")
    comp_rules = comp_rules.replace("(r)", "®")
    comp_rules = re.sub(r"\n\s{4,}(\w)", r" \1", comp_rules)

    rules = re.findall('^(\d{3}\.[^\s.]{1,3})[\s.]*(.*)(?:\n(Example: .*))?(?:\n(Example: .*))?(?:\n(Example: .*))?(?:\n(Example: .*))?',
                       comp_rules,
                       re.MULTILINE)

    with open('rules.json', 'w', encoding='utf-8') as output:
        for rule in rules:
            new_rule = {'ruleNumber': rule[0], 'ruleText': rule[1]}
            rules_json.append(new_rule)
        output.write(json.dumps(rules_json, indent=4))

    with open('examples.json', 'w', encoding='utf-8') as examples_output:
        examples_json = []
        for rule in rules:
            nonempty_examples = []
            for ex in rule[2:5]:
                if ex != '':
                    nonempty_examples.append(ex)
            actual_examples = '\n'.join(nonempty_examples)
            if (actual_examples) == '':
                actual_examples = "Example not found"
            new_example = {'exampleText': actual_examples,
                           'ruleNumber': rule[0]}
            examples_json.append(new_example)
        examples_output.write(json.dumps(examples_json, indent=4))
