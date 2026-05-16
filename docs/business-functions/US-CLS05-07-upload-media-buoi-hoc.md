# US-CLS05-07: Upload & Quan ly Media buoi hoc (Session Gallery)

> Tai lieu dang cho bien tap

## Boi canh (Context)
- **Vi tri:** Section/Tab "Media" nam trong man hinh Quan ly buoi hoc (US-CLS05-01).
- **Muc dich:** GV upload anh/video ghi lai hoat dong trong buoi hoc. VD: Anh bang trang, Video HV thuyet trinh, Anh ket qua tro choi nhom, Video GV ghi nhan xet.

## Luong nghiep vu (Business Flow)
1. GV ket thuc buoi hoc.
2. GV mo man hinh Quan ly buoi hoc -> Tab Media.
3. GV chup anh hoac chon anh/video tu thu vien dien thoai.
4. GV upload len he thong (co the upload nhieu file cung luc).
5. Media duoc gan vao dung Session ID cua buoi hoc do.
6. Media co the duoc gui cho Phu huynh qua App/Zalo (tuy cau hinh).
7. Media hien thi trong Student 360 View (US-CLS03-09: Tab Lich su Buoi hoc).

## De xuat Giao dien (Expected UI/UX)
- **Gallery Grid:** Hien thi anh/video dang luoi (Grid) hoac dang Carousel.
- **Upload Area:** Keo tha (Drag & Drop) hoac nut [+ Them anh/video].
- **Moi file co the gan Tag:** "Ket qua hoat dong", "Bang trang", "Bai tap nhom", "Khac".
- **Action:** Nut [Gui cho Phu huynh] de push media den App PH cua toan bo HV trong lop.
- **Gioi han:** Toi da 10 file/buoi, moi file khong qua 50MB.

## Nguon du lieu (Data Provider)
- Du lieu noi bo cua BF-CLS-05 (Session media records)
- Lien ket hien thi: US-CLS03-09 (Student 360 - Tab Lich su Buoi hoc)
