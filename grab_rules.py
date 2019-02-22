import json
import re

rules_json = []
with open("cr.txt", 'r', encoding='utf-8') as comp_rules:
    comp_rules = comp_rules.read()
    rules = re.findall('^(\d{3}\.\d+[a-z]?)\.?\s(.*)', 
                       comp_rules, 
                       re.MULTILINE)

    with open('rules.json', 'w', encoding='utf-8') as output:
        for rule in rules:
            new_rule = {'ruleNumber': rule[0], 'ruleText': rule[1]}
            rules_json.append(new_rule)
        output.write(json.dumps(rules_json, indent=4))