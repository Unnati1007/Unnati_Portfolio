import urllib.request
import re

urls = {
    "gfg": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/geeksforgeeks.svg",
    "codechef": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/codechef.svg",
    "hackerrank": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/hackerrank.svg",
    "codeforces": "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/codeforces.svg"
}

with open("svgs_output.txt", "w", encoding="utf-8") as f:
    for name, url in urls.items():
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                html = response.read().decode('utf-8')
                match = re.search(r'd="([^"]+)"', html)
                if match:
                    f.write(f"{name}_PATH = \"{match.group(1)}\"\n\n")
                else:
                    f.write(f"{name}: path not found\n\n")
        except Exception as e:
            f.write(f"Error {name}: {e}\n\n")
print("Saved to file")
