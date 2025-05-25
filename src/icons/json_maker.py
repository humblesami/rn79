import os
import re


def generate_icons_json(folder_path, app_icon_names=[]):
    icons_dict = {}
    app_icons_dict = {}
    long_icons_dict = {}

    # Iterate through files in the specified folder
    print(folder_path)
    patterns = []
    for icon_name in app_icon_names:
        pat = re.compile(fr'(?i)(^|_){re.escape(icon_name)}(_|$)')
        patterns.append(pat)
    for filename in sorted(os.listdir(folder_path)):
        if filename.endswith(".svg"):
            # Remove ".svg" extension from the filename
            key = filename.replace(" ", "_").replace("-", "_")[:-4]

            # Read the content of the SVG file
            svg_file_path = os.path.join(folder_path, filename)
            with open(svg_file_path, "r", encoding="utf-8") as file:
                value = file.read()
                value = value.replace('\n', '').replace('\r', '')
                value = remove_svg_comments(value)

            is_app_icon = False
            for pat in patterns:
                if pat.match(key):
                    is_app_icon = True
            if is_app_icon:
                app_icons_dict[key] = value

            if len(value) > 2499:
                long_icons_dict[key] = value
            else:
                icons_dict[key] = value

    return {'all': icons_dict, 'long': long_icons_dict, 'app': app_icons_dict}


def remove_svg_comments(svg_content):
    # Remove comments from the SVG content
    return re.sub(r'<!--(.*?)-->', '', svg_content, flags=re.DOTALL)


def save_icons_json(icons_dict, output_path, export_as='JsonIcons'):
    # Convert dictionary to JSON string
    icons_json_string = 'export default ' + export_as + ' = {'
    for key in icons_dict:
        icons_json_string += "\n\t" + key + ": { name: '" + key + "', svg: '" + icons_dict[key] + "' },"

    icons_json_string = icons_json_string[:-1] + '\n}'
    # Write JSON string to a file
    with open(output_path, "w", encoding="utf-8") as json_file:
        json_file.write(icons_json_string)


def init_process():
    # Specify the folder path where your SVG icons are located
    cur_folder = os.path.dirname(os.path.realpath(__file__))

    # Generate icons dictionary
    app_icon_names = [
        'bank', 'transaction', 'group', 'category', 'database', 'db',
        'setting', 'menu', 'expense', 'add', 'file', 'icon', 'image',
        'save', 'close', 'cancel', 'delete', 'edit'
    ]
    generated = generate_icons_json(cur_folder + '/svg_files', app_icon_names)

    # Specify the output file path
    output_json_app = os.path.join(cur_folder, "IconsForApp.js")
    output_json_all = os.path.join(cur_folder, "JsonIcons.js")
    output_json_long = os.path.join(cur_folder, "JsonIconsLong.js")

    # Save icons dictionary to JSON file
    save_icons_json(generated['app'], output_json_app, 'IconsForApp')
    save_icons_json(generated['all'], output_json_all, 'JsonIcons')
    save_icons_json(generated['long'], output_json_long, 'JsonIconsLong')

    print(f"Icons dictionary has been saved {output_json_all}")


init_process()
