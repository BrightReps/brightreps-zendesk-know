import codecs
import json
import markdown2
import os


PROJECT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EN_FILE = os.path.join(PROJECT_DIR, 'src', 'translations', 'en.json')
OUT_FOLDER = os.path.join(PROJECT_DIR, '_build')


with open(EN_FILE, 'rb') as f:
    copy_raw = json.loads(f.read())


for key in ('long_description', 'installation_instructions',):
    text = copy_raw['app'].get(key)
    html = markdown2.markdown(text)
    output_file_name = "{}.html".format(key)
    output_file_path = os.path.join(OUT_FOLDER, output_file_name)
    output_file = codecs.open(output_file_name, "w", encoding="utf-8",
                              errors="xmlcharrefreplace")
    output_file.write(html)
    print "Generated: {}".format(output_file_name)
