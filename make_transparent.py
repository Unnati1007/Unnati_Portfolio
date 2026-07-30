from PIL import Image

def main():
    img_path = "c:\\Users\\HP\\Desktop\\Portfolio\\public\\leetcode-logo.png"
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Detect near-white pixels
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(img_path, "PNG")
    print("Done")

if __name__ == "__main__":
    main()
