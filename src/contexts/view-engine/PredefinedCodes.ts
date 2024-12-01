import { PREVIEW_CONTAINER, RUNTIME_ERROR_CONTAINER } from "@metadata/preview";

export const VIEW_INIT_CODE = `
import sys
from js import console
from js import document
import matplotlib.pyplot as plt

plt.clf()

previewContainer = document.getElementById("${PREVIEW_CONTAINER}")
runtimeErrorContainer = document.getElementById("${RUNTIME_ERROR_CONTAINER}")

previewContainer.innerHTML = ''
runtimeErrorContainer.innerHTML = ''

class CustomOutput:
    def write(self, text):
        previewContainer.innerHTML += ("<pre>" + text + "</pre>")

class CustomError:
    def write(self, text):
        if runtimeErrorContainer:
            runtimeErrorContainer.innerHTML += ("<div><font color='red'>" + text + "</font></div>")

sys.stderr = CustomError()
sys.stdout = CustomOutput()
`;

export const FONT_INIT_CODE = `
import os
import requests
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import matplotlib


font_url = 'https://themes.googleusercontent.com/static/fonts/earlyaccess/nanumgothic/v3/NanumGothic-Regular.ttf'
font_path = '/NanumGothic-Regular.ttf'

response = requests.get(font_url)
with open(font_path, 'wb') as f:
    f.write(response.content)

fm.fontManager.addfont(font_path)
prop = fm.FontProperties(fname=font_path)

matplotlib.rc('font', family='sans-serif') 
matplotlib.rcParams.update({
    'font.sans-serif': prop.get_name(),
})
`;
