import json

def txt_to_json(input_file, output_file):
    data = []
    with open(input_file, 'r', encoding='utf-8') as file:
        for line in file:
            word, meaning = line.strip().split(',', 1)
            data.append({'word': word.strip(), 'meaning': meaning.strip()})
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        json.dump(data, outfile, ensure_ascii=False, indent=2)

# テキストファイルから読み取り、JSONファイルに書き込み
txt_to_json('words.txt', 'words.json')
