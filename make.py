import click
import codecs
import io
import json
import markdown2
import os


PROJECT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)))
EN_FILE = os.path.join(PROJECT_DIR, 'src', 'translations', 'en.json')
EN_BASE_FILE = os.path.join(PROJECT_DIR, 'copy', 'en-base.json')
LONG_DESCR_FILE = os.path.join(PROJECT_DIR, 'copy', 'long_description.md')
INSTALL_INSTR_FILE = os.path.join(PROJECT_DIR, 'copy',
                                  'installation_instructions.md')
OUT_FOLDER = os.path.join(PROJECT_DIR, '_build')


def generate_test_html():
    with open(EN_FILE, 'rb') as f:
        copy_raw = json.loads(f.read())
    for key in ('long_description', 'installation_instructions',):
        text = copy_raw['app'].get(key)
        html = markdown2.markdown(text)
        output_file_name = "{}.html".format(key)
        output_file_path = os.path.join(OUT_FOLDER, output_file_name)
        output_file = codecs.open(output_file_path, "w", encoding="utf-8",
                                  errors="xmlcharrefreplace")
        output_file.write(html)
        click.echo("Generated test html: %s" % output_file_name)


@click.command()
@click.option('--update', is_flag=True)
@click.option('--make_html', is_flag=True)
def generate_copy(update, make_html):
    if update:
        with open(EN_BASE_FILE, 'rb') as f:
            en_file = json.loads(f.read())
        with open(LONG_DESCR_FILE) as f:
            long_description = f.read()
        with open(INSTALL_INSTR_FILE) as f:
            installation_instructions = f.read()
        en_file['app']['long_description'] = long_description
        en_file['app']['installation_instructions'] = installation_instructions
        write_en_file(en_file)
    if make_html:
        generate_test_html()


def write_en_file(data):
    click.echo("Name: %s" % data['app']['name'])
    with open(EN_FILE, 'w') as f:
        as_str = json.dumps(data, indent=2, sort_keys=True)
        f.write(as_str)
    click.echo("Wrote updated en.json file")


if __name__ == '__main__':
    generate_copy()
