// ============================================================================
//  ĐƯỜNG CHUYỂN TOÀN BỘ THÔNG TIN: ĐIỆN THOẠI (thầy) -> LAPTOP (thầy) -> CHIẾU LÊN TV
//  Chỉ phục vụ thầy Phạm Ngọc Hưng và dữ liệu CỦA THẦY.
//  PHIÊN BẢN 25 (22/11/2026):
//  - TRANG CHỦ 3 TAB THỐNG NHẤT: "📦 Hộp đen" | "🔔 Bấm chuông" |
//    "🔍 Đội điều tra" — 1 thanh tab ở đầu mọi trang host (menu, chi
//    tiết, xem tất cả, chuông, điều tra). Mỗi tab là 1 link nạp lại
//    trang với tham số của tab đó (máy chủ vẽ sẵn đúng tab, KHÔNG nạp
//    cả 3 tab cùng lúc — đỡ nặng, đỡ lag). Bí danh ?tab=hopden /
//    ?tab=buzzer / ?tab=dieutra (tương đương ?hd3= cũ, vẫn chạy).
//    Chỉ đổi điều hướng + khung ngoài; nội dung và chức năng của cả
//    3 mục giữ nguyên (menu 6 máy, chuông mở/khóa/đặt lại, điều tra
//    + nhận xét, nút "Làm mới trang" tay, target="_top").
//  PHIÊN BẢN 24 (22/11/2026):
//  - HĐ3 LUYỆN TẬP — BÀI 4 LỚP 8 ("Nguy cơ rò rỉ dữ liệu cá nhân"):
//    backend cho 3 việc của học sinh trong giờ luyện tập, lưu RIÊNG trong
//    thư mục Drive mới "HĐ3 Luyện tập Bài 4" (KHÔNG dùng chung thư mục
//    "Anh trinh chieu Avatar AI", KHÔNG động vào dữ liệu "Biến hình").
//      + CHUÔNG BẤM NHANH (loai "buzzer"): mỗi đội bấm chuông 1 lần cho
//        mỗi câu (Câu 1-4). Máy chủ chỉ ghi lượt bấm ĐẦU TIÊN của mỗi đội
//        trong mỗi câu; chỉ ghi khi đúng câu đang mở VÀ chuông đang mở
//        (host mở câu, khóa câu). Trang host ?hd3=buzzer: mở Câu 1-4,
//        khóa chuông, đặt lại, bảng xếp hạng theo giờ bấm của máy chủ
//        (hiện số giây từ lúc mở chuông, ví dụ "0.8s" + giờ tuyệt đối).
//        Đặt lại (datlai) XÓA HẾT lượt bấm của CẢ 4 câu + khóa chuông.
//      + ĐIỀU TRA (loai "dieutra"): mỗi đội nộp 1 bản — "Không nên nhập"
//        hay "Nên nhập" (shouldEnter "khong"/"co"), dấu hiệu đã chọn
//        (signs: số 1-4), hành động sẽ làm (action). Gửi lại thì GHI ĐÈ
//        bản cũ của đúng đội đó.
//      + NHẬN XÉT (loai "nhanxet"): đội này nhận xét đội kia
//        (fromTeam -> toTeam + text). Trang host ?hd3=dieutra hiện TẤT CẢ
//        bản điều tra + nhận xét gom dưới từng đội.
//    doPost: payload có loai "buzzer"/"dieutra"/"nhanxet" thì đi nhánh HĐ3
//    rồi trả về ngay; loai vắng mặt thì luồng "Biến hình" cũ chạy y như
//    trước. doGet: tham số hd3 kiểm tra TRƯỚC các nhánh cũ.
//    Trang host vẽ sẵn phía máy chủ, KHÔNG google.script.run, KHÔNG meta
//    refresh — thầy bấm "Làm mới trang" như trang trình chiếu cũ.
//  PHIÊN BẢN 23 (21/11/2026):
//  - DỮ LIỆU GIẢ LẬP — THỜI GIAN DÙNG APP + KẾT LUẬN SỞ THÍCH: thầy dạy bài 4
//    lớp 8 (8.A2.1) muốn trang trình chiếu "bịa" ra thời gian dùng TikTok /
//    YouTube / Facebook / Zalo (tính theo tuần) và 1 đoạn kết luận sở thích
//    cho MỖI MÁY — mỗi máy 1 con số khác nhau, 1 sở thích khác nhau — để
//    minh họa cách AI dùng dữ liệu hành vi để định hướng lựa chọn.
//      + Số liệu TÍNH NGAY TRÊN MÁY CHỦ từ khóa máy (băm chuỗi "may-N" /
//        idMay) nên CÙNG 1 máy LUÔN hiện CÙNG 1 con số (mở lại vẫn vậy),
//        máy khác thì số khác. Không đọc từ điện thoại, không lưu lên
//        Drive, không gửi từ app điện thoại.
//      + CHỈ hiện khi máy KHÔNG có thoiGianDungApp THẬT (APK, bản 14).
//        Máy nào đã có dữ liệu thật thì hiện bảng thật như bản 14, không
//        thêm giả lập.
//      + NHÃN RÕ RÀNG "GIẢ LẬP" + dòng "(Dữ liệu mô phỏng để minh họa —
//        không phải dữ liệu thật)" — đây là bài dạy về AI thao túng nên
//        tuyệt đối không được để học sinh tưởng số liệu giả là thật.
//      + Hiện trên THẺ MÁY (trang chi tiết ?xem=<khóa> và "Xem tất cả"
//        ?xem=tat-ca). MENU không đổi (chỉ tên + giờ gửi, vẫn nhanh).
//      + Không động vào doPost / app điện thoại / file JSON trên Drive.
//  PHIÊN BẢN 22 (21/11/2026):
//  - MENU CHỈ HIỆN ĐÚNG 6 MÁY GỬI GẦN NHẤT (thay thế luật 60 phút của
//    bản 21): xếp mới nhất lên trên, lấy đúng 6 máy đầu; máy cũ hơn
//    ẩn khỏi menu nhưng KHÔNG bị xóa — "Xem tất cả" và trang chi tiết
//    vẫn xem được máy cũ. Không có máy nào gửi thì menu báo "Chưa có
//    máy nào gửi." + link "Xem tất cả".
//  - Giữ nguyên bản 21: menu dùng 1 FILE CHỈ MỤC duy nhất
//    "danh-sach-may.json" (1 lần đọc) + CACHE 60 giây (CacheService);
//    doPost cập nhật chỉ mục ngay khi có máy gửi mới (lỗi thì bỏ qua,
//    không làm hỏng lần gửi); chưa có chỉ mục thì menu quét nhẹ như
//    bản 20 rồi tự ghi lại chỉ mục.
//  PHIÊN BẢN 21 (21/11/2026):
//  - NHANH HƠN NỮA (menu chỉ còn 1 lần đọc): trước đây menu vẫn quét
//    CẢ thư mục Drive mỗi lần mở (đọc từng file JSON + duyệt tên file)
//    nên Apps Script vẫn chậm. Giờ menu dùng 1 FILE CHỈ MỤC duy nhất
//    "danh-sach-may.json" trong cùng thư mục — chỉ 1 lần đọc là có đủ
//    tên máy + giờ gửi + số ảnh + có giọng nói. doPost cập nhật chỉ mục
//    ngay khi có máy gửi mới (lỗi thì bỏ qua, không làm hỏng lần gửi);
//    chưa có chỉ mục thì menu quét nhẹ như bản 20 rồi tự ghi lại chỉ mục.
//    Thêm CACHE 60 giây (CacheService): menu mở lại trong 60 giây thì
//    lấy từ cache, không đọc Drive; gửi mới / xóa máy thì xóa cache.
//  - (Luật menu của bản 21 — chỉ hiện máy gửi trong 60 phút qua — đã
//    được bản 22 thay bằng "đúng 6 máy gửi gần nhất".)
//  PHIÊN BẢN 20 (21/11/2026):
//  - CHẠY NHANH HƠN NHIỀU: trước đây mỗi lần mở trang đều gọi
//    layThongTinTatCaMay() — đọc và base64 TOÀN BỘ ảnh + giọng nói của
//    TẤT CẢ các máy nên trang rất nặng và rất chậm. Giờ:
//      + Trang MENU chỉ gọi layDanhSachMayNhe() — chỉ đọc file JSON
//        metadata (nhỏ) + TÊN file trong thư mục, KHÔNG đọc ảnh/âm
//        thanh, KHÔNG base64. Menu chỉ cần tên + giờ gửi.
//      + Trang CHI TIẾT chỉ tải ĐẦY ĐỦ dữ liệu của ĐÚNG 1 máy đó
//        (layThongTinMotMay); huy hiệu "ĐANG DÙNG" vẫn tính bằng
//        danh sách nhẹ (so giờ gửi).
//      + "Xem tất cả" vẫn tải đủ mọi máy như trước (chỉ mở khi cần).
//  PHIÊN BẢN 19 (21/11/2026):
//  - SỬA LỖI ĐIỀU HƯỚNG TRONG KHUNG NHÚNG: bấm vào dòng menu / "Xem tất
//    cả" / "← Quay lại menu" / "Làm mới trang" / nút xóa thì khung nhúng
//    Apps Script báo "script.google.com đã từ chối kết nối" vì link điều
//    hướng BÊN TRONG iframe. Tất cả link điều hướng trong trang trình
//    chiếu giờ có target="_top" để mở ở cấp cao nhất, thoát khỏi khung
//    nhúng. Link tải về (ảnh/danh bạ/giọng nói), link xem ảnh lớn (#...)
//    và link Google Maps KHÔNG đổi.
//  PHIÊN BẢN 18 (21/11/2026):
//  - MENU XẾP THEO THỜI GIAN: máy gửi mới nhất lên TRÊN CÙNG, máy chưa
//    gửi xuống cuối. Mỗi dòng menu hiện ngày + giờ gửi NHỎ Ở GÓC TRÊN PHẢI
//    của dòng (tên máy vẫn to bên trái, huy hiệu "ĐANG DÙNG" cạnh tên máy).
//  - TIÊU ĐỀ MỚI: "HỘP ĐEN THU THẬP DỮ LIỆU NGƯỜI DÙNG" — tiêu đề chính
//    trên mọi trang trình chiếu (menu / chi tiết / xem tất cả); giao diện
//    "hộp đen" tối gọn, viền vàng, chữ lớn dễ đọc trên laptop/TV.
//  PHIÊN BẢN 17 (21/11/2026):
//  - MENU DANH SÁCH MÁY: trang trình chiếu mặc định giờ là MENU — danh sách
//    tất cả các máy, mỗi dòng hiện TÊN MÁY to + GIỜ GỬI ("Gửi lúc HH:MM ngày
//    DD/MM/YYYY") + huy hiệu "ĐANG DÙNG" cho máy gửi gần nhất. Bấm 1 dòng
//    (?xem=<khóa>) -> trang chi tiết chỉ 1 máy đó; "Xem tất cả"
//    (?xem=tat-ca) -> lưới tất cả các thẻ như trước. Trang chi tiết / xem
//    tất cả có link "← Quay lại menu". Xóa xong cũng quay lại menu.
//    Khóa xem: ô Máy -> "may-N" (may-1..may-6); máy theo tên -> idMay.
//  - Vẫn vẽ sẵn phía máy chủ, không JavaScript, không google.script.run,
//    không meta refresh; giữ nguyên "Làm mới trang", nút xóa, trình phát
//    giọng nói, hộp xem ảnh lớn, bảng thời gian dùng app.
//  PHIÊN BẢN 16 (21/11/2026):
//  - GIỌNG NÓI: app trên điện thoại gửi kèm file âm thanh đã thu (amThanh:
//    {duLieu base64, dinhDang mime}) — lưu thành file mayN_giong-noi.<ext>
//    hoặc id_<id>_giong-noi.<ext> trong cùng thư mục Drive; trang trình
//    chiếu hiện trình phát <audio controls> + nút "Tải giọng nói về" trên
//    thẻ máy đó. Gửi lại / xóa máy thì xóa luôn file âm thanh của máy đó.
//  PHIÊN BẢN 15 (21/11/2026):
//  - XÓA DỮ LIỆU 1 MÁY: mỗi thẻ máy có nút "🗑 Xóa dữ liệu máy này".
//    Bấm nút -> trang XÁC NHẬN (chưa xóa gì) -> bấm "Xóa ngay" mới xóa
//    thật file JSON + ảnh của đúng máy đó khỏi Drive. Không có nút xóa tất cả.
//  - Dữ liệu thu thập lưu trên Google Drive của thầy (thư mục
//    "Anh trinh chieu Avatar AI"), KHÔNG lưu trên GitHub — GitHub chỉ
//    chứa code. Xóa ở đây là xóa khỏi Drive.
//  PHIÊN BẢN 14 (21/11/2026):
//  - Hỗ trợ NHIỀU MÁY gửi cùng lúc theo 2 cách:
//    (a) Ô Máy 1..Máy 5 (app Avatar AI + trang gửi ?page=gui + trang quét web cũ):
//        mỗi máy lưu riêng, gửi mới chỉ thay dữ liệu của đúng máy đó.
//    (b) Máy THEO TÊN (app "Biến Hình AI" v1.1): mỗi điện thoại có tên riêng
//        (tenMay, mặc định theo model máy) + mã duy nhất (idMay = Android ID).
//        Lưu theo idMay, không động vào các ô Máy. Hai máy trùng tên cũng
//        không bao giờ nhầm nhau.
//  - App "Biến Hình AI" gửi kèm thời gian dùng app CÓ CẤU TRÚC
//    (thoiGianDungApp: ngày, tổng ms, từng app ms + số lần mở) — trang trình
//    chiếu hiện thành bảng "THỜI GIAN DÙNG APP" trên thẻ của máy đó.
//  - Thẻ của máy gửi GẦN NHẤT (theo thoiGianGui, tính trên CẢ ô Máy lẫn máy
//    theo tên) được gắn huy hiệu "ĐANG DÙNG"; mỗi thẻ có giờ gửi.
//  - Trang gửi: thầy chọn số máy của mình trước khi gửi (ô Máy).
//  - Trang trình chiếu: hiện CẢ 4-5 MÁY CÙNG LÚC trên một lưới linh hoạt.
//  - Kinh/vĩ độ bấm vào mở Google Maps.
//  - KHÔNG thu thập dữ liệu của học sinh. Không gửi dữ liệu đi đâu khác.
//  Cách dùng:
//    * Trang gửi (điện thoại):  <URL web app>?page=gui
//    * Trang trình chiếu (laptop):  <URL web app>   (không thêm gì)
// ============================================================================

// Tên thư mục trên Google Drive của thầy (tự tạo nếu chưa có)
var TEN_THU_MUC = 'Anh trinh chieu Avatar AI';
// Số máy hiển thị ô trống trên trang trình chiếu (Máy 1..Máy 5).
// doPost chấp nhận tới Máy 6; máy nào gửi thì cũng hiện thêm ô.
var SO_MAY_HIEN = 5;
var SO_MAY_TOI_DA = 6;

// ---------- HĐ3 LUYỆN TẬP — BÀI 4 LỚP 8 (PHIÊN BẢN 24) ----------
// Thư mục RIÊNG trên Drive cho HĐ3 — KHÔNG dùng chung TEN_THU_MUC.
var TEN_THU_MUC_HD3 = 'HĐ3 Luyện tập Bài 4';
var TEN_FILE_BUZZER_HD3 = 'buzzer.json';
var TEN_FILE_DIEU_TRA_HD3 = 'dieutra.json';
var TEN_FILE_NHAN_XET_HD3 = 'nhanxet.json';
var TEN_FILE_TRANG_THAI_HD3 = 'hd3-trangthai.json';

// Link web app (dùng cho nút "Làm mới trang" và các link Xóa).
var URL_WEB_APP = 'https://script.google.com/macros/s/AKfycbw6K57VCKeT8w5oLfaUZsrLyfuJDcJaGWn0Crp5AP8IECVzo4zwse8CilJ5B5ckGTQ0/exec';

// Tên file JSON của 1 máy: thong-tin-may-N.json
function tenFileThongTinMay(soMay) {
  return 'thong-tin-may-' + soMay + '.json';
}

// Tiền tố tên file ảnh của 1 máy: mayN_ (ví dụ may1_anh-1.jpg)
function tienToAnhMay(soMay) {
  return 'may' + soMay + '_';
}

// ---------- Tiện ích Drive ----------

// Lấy thư mục chứa dữ liệu; tạo mới nếu chưa có.
function layThuMucAnh() {
  var ds = DriveApp.getFoldersByName(TEN_THU_MUC);
  if (ds.hasNext()) return ds.next();
  return DriveApp.createFolder(TEN_THU_MUC);
}

// Chuẩn hóa số máy từ nhiều dạng: 1-6, "1"-"6", "Máy 1"-"Máy 6", "may 1"...
// Ngoài khoảng 1-6 hoặc không đọc được thì về Máy 1.
function chuanHoaSoMay(giaTri) {
  var so = 1;
  if (giaTri === undefined || giaTri === null || giaTri === '') return 1;
  if (typeof giaTri === 'number') {
    so = Math.floor(giaTri);
  } else {
    var chu = String(giaTri);
    var tim = chu.match(/\d+/);
    if (tim) so = parseInt(tim[0], 10);
  }
  if (isNaN(so) || so < 1) so = 1;
  if (so > SO_MAY_TOI_DA) so = SO_MAY_TOI_DA;
  return so;
}

// Xóa dữ liệu cũ của ĐÚNG 1 máy: file JSON của máy + ảnh có tiền tố của máy.
// Không động vào dữ liệu của các máy khác.
// (Khi Máy 1 gửi lại, dọn luôn file cũ thời chỉ có 1 máy: thong-tin.json + ảnh không tiền tố.)
function xoaDuLieuMay(thuMuc, soMay) {
  var tenJson = tenFileThongTinMay(soMay);
  var tienTo = tienToAnhMay(soMay);
  var files = thuMuc.getFiles();
  while (files.hasNext()) {
    var f = files.next();
    var ten = f.getName();
    if (ten === tenJson || ten.indexOf(tienTo) === 0) {
      f.setTrashed(true);
      continue;
    }
    if (soMay === 1) {
      // Dọn dữ liệu cũ thời chỉ có 1 máy (không có số máy).
      if (ten === 'thong-tin.json') {
        f.setTrashed(true);
        continue;
      }
      if (ten.slice(-5) !== '.json' && ten.indexOf('may') !== 0) {
        f.setTrashed(true);
      }
    }
  }
}

// Làm sạch một chuỗi (bỏ khoảng trắng thừa, không cho null).
function sachChuoi(giaTri) {
  return giaTri ? String(giaTri).trim() : '';
}

// Làm sạch danh sách danh bạ [{ten, so}] — chỉ giữ người có tên hoặc số.
function sachDanhBa(danhBa) {
  var ketQua = [];
  if (!danhBa) return ketQua;
  for (var i = 0; i < danhBa.length; i++) {
    var nguoi = danhBa[i];
    if (!nguoi) continue;
    var ten = sachChuoi(nguoi.ten);
    var so = sachChuoi(nguoi.so);
    if (ten === '' && so === '') continue;
    ketQua.push({ ten: ten, so: so });
  }
  return ketQua;
}

// ---------- Lưu theo TÊN MÁY (app "Biến Hình AI" v1.1, Phiên bản 14) ----------
// Mỗi điện thoại có tên riêng (tenMay) + mã duy nhất (idMay = Android ID).
// Chỉ giữ ký tự [A-Za-z0-9_-] trong idMay, rồi thêm tiền tố "id_".
// Trả về '' nếu không có idMay dùng được (khi đó dùng logic ô Máy cũ).
function sachIdMay(idMay) {
  var chu = String(idMay === undefined || idMay === null ? '' : idMay);
  chu = chu.replace(/[^A-Za-z0-9_-]/g, '');
  return chu === '' ? '' : 'id_' + chu;
}

// Tên file JSON của 1 máy theo tên: thong-tin-id_<id>.json
function tenFileThongTinTheoTen(safeId) {
  return 'thong-tin-' + safeId + '.json';
}

// Tiền tố tên file ảnh của 1 máy theo tên: id_<id>_ (ví dụ id_abc123_anh-1.jpg)
function tienToAnhTheoTen(safeId) {
  return safeId + '_';
}

// Tên file âm thanh của 1 máy (Phiên bản 16): mayN_giong-noi.<ext> hoặc
// id_<id>_giong-noi.<ext>. Cùng tiền tố với ảnh của máy đó nên gửi lại /
// xóa máy đều dọn luôn file âm thanh của đúng máy đó.
function tenFileAmThanhMay(soMay, ext) {
  return 'may' + soMay + '_giong-noi.' + ext;
}

function tenFileAmThanhTheoTen(safeId, ext) {
  return safeId + '_giong-noi.' + ext;
}

// Xóa dữ liệu cũ của ĐÚNG 1 máy theo tên: file JSON của máy + ảnh có tiền tố
// của máy đó. Không động vào dữ liệu của các máy khác (kể cả ô Máy).
function xoaDuLieuTheoTen(thuMuc, safeId) {
  var tenJson = tenFileThongTinTheoTen(safeId);
  var tienTo = tienToAnhTheoTen(safeId);
  var files = thuMuc.getFiles();
  while (files.hasNext()) {
    var f = files.next();
    var ten = f.getName();
    if (ten === tenJson || ten.indexOf(tienTo) === 0) {
      f.setTrashed(true);
    }
  }
}

// ---------- XÓA DỮ LIỆU 1 MÁY THEO YÊU CẦU (Phiên bản 15) ----------
// Dữ liệu thu thập lưu trên Google Drive của thầy (thư mục
// "Anh trinh chieu Avatar AI"), KHÔNG lưu trên GitHub — GitHub chỉ chứa
// code. Xóa ở đây là xóa file JSON + ảnh của đúng máy đó khỏi Drive.
// id xóa có 2 dạng:
//   - ô Máy: "1"-"6" hoặc "Máy 1"-"Máy 6"
//   - máy theo tên: idMay (ví dụ "id_may-cua-thay" đã có tiền tố id_,
//     hoặc "may-cua-thay" chưa có tiền tố — đều nhận)

// Chuẩn hóa id máy theo tên để xóa: nhận cả "id_abc123" (đã có tiền tố)
// lẫn "abc123" (chưa có). Trả về '' nếu không đọc được.
function sachIdMayDeXoa(id) {
  var chu = String(id === undefined || id === null ? '' : id).trim();
  chu = chu.replace(/[^A-Za-z0-9_-]/g, '');
  if (chu === '') return '';
  if (chu.indexOf('id_') === 0) return chu;
  return 'id_' + chu;
}

// Máy đó có dữ liệu không? (có file JSON hoặc có ảnh mang tiền tố của máy)
function coDuLieuMayTrongThuMuc(thuMuc, tenJson, tienTo) {
  var files = thuMuc.getFiles();
  while (files.hasNext()) {
    var ten = files.next().getName();
    if (ten === tenJson || ten.indexOf(tienTo) === 0) return true;
  }
  return false;
}

// Lấy nhãn hiển thị của 1 máy từ id yêu cầu xóa (để hiện trên trang xác nhận):
// ô Máy -> "Máy N"; máy theo tên -> tenMay trong file JSON (không đọc được
// thì dùng chính id đó).
function nhanMayDeXoa(idNhan) {
  var thuMuc = layThuMucAnh();
  var id = String(idNhan === undefined || idNhan === null ? '' : idNhan).trim();
  if (id === '') return '';
  var maySo = id.match(/^\s*(?:m[aá]y\s*)?([1-6])\s*$/i);
  if (maySo) return 'Máy ' + chuanHoaSoMay(maySo[1]);
  var safeId = sachIdMayDeXoa(id);
  if (safeId === '') return id;
  var files = thuMuc.getFilesByName(tenFileThongTinTheoTen(safeId));
  if (files.hasNext()) {
    try {
      var goi = JSON.parse(files.next().getBlob().getDataAsString());
      if (goi && goi.tenMay) return String(goi.tenMay);
    } catch (loiDoc) {
      // Đọc lỗi thì dùng id.
    }
  }
  return safeId;
}

// Xóa dữ liệu của ĐÚNG 1 máy (ô Máy hoặc máy theo tên).
// Trả về {timThay: true/false, nhan: 'Máy N' | tenMay}.
// "Tìm thấy" = máy đó có file JSON hoặc có ảnh. Gửi mới từ đúng máy đó
// sau khi xóa vẫn chạy bình thường (thẻ mới hiện lại).
function xoaDuLieuMotMay(idNhan) {
  var thuMuc = layThuMucAnh();
  var id = String(idNhan === undefined || idNhan === null ? '' : idNhan).trim();
  if (id === '') return { timThay: false, nhan: '' };
  var maySo = id.match(/^\s*(?:m[aá]y\s*)?([1-6])\s*$/i);
  if (maySo) {
    var so = chuanHoaSoMay(maySo[1]);
    var co = coDuLieuMayTrongThuMuc(thuMuc, tenFileThongTinMay(so), tienToAnhMay(so));
    xoaDuLieuMay(thuMuc, so);
    return { timThay: co, nhan: 'Máy ' + so };
  }
  var safeId = sachIdMayDeXoa(id);
  if (safeId === '') return { timThay: false, nhan: '' };
  var coTen = coDuLieuMayTrongThuMuc(thuMuc, tenFileThongTinTheoTen(safeId), tienToAnhTheoTen(safeId));
  var nhanTen = nhanMayDeXoa(id);
  xoaDuLieuTheoTen(thuMuc, safeId);
  return { timThay: coTen, nhan: nhanTen };
}

// Làm sạch thời gian dùng app {ngay, tongMs, apps:{TikTok:{ms,lanMo},...}}.
// Chấp nhận object hoặc chuỗi JSON. Trả về null nếu không đọc được.
function sachThoiGianDungApp(giaTri) {
  if (!giaTri) return null;
  if (typeof giaTri === 'string') {
    try { giaTri = JSON.parse(giaTri); } catch (loi) { return null; }
  }
  if (!giaTri || typeof giaTri !== 'object') return null;
  var apps = {};
  var tenApp = ['TikTok', 'Facebook', 'Zalo', 'YouTube'];
  var nguon = giaTri.apps || {};
  for (var i = 0; i < tenApp.length; i++) {
    var a = nguon[tenApp[i]] || {};
    var ms = Math.floor(Number(a.ms) || 0);
    var lanMo = Math.floor(Number(a.lanMo) || 0);
    if (ms < 0) ms = 0;
    if (lanMo < 0) lanMo = 0;
    apps[tenApp[i]] = { ms: ms, lanMo: lanMo };
  }
  var tongMs = Math.floor(Number(giaTri.tongMs) || 0);
  if (tongMs < 0) tongMs = 0;
  return {
    ngay: sachChuoi(giaTri.ngay),
    tongMs: tongMs,
    apps: apps
  };
}

// ---------- GIỌNG NÓI (Phiên bản 16) ----------
// Làm sạch trường âm thanh {duLieu (base64, không có tiền tố data:),
// dinhDang (mime, ví dụ "audio/webm")}. Chấp nhận object hoặc chuỗi JSON.
// Trả về null nếu không đọc được / rỗng (khi đó coi như máy không gửi giọng nói).
function sachAmThanh(amThanh) {
  if (!amThanh) return null;
  if (typeof amThanh === 'string') {
    try { amThanh = JSON.parse(amThanh); } catch (loi) { return null; }
  }
  if (!amThanh || typeof amThanh !== 'object') return null;
  var duLieu = sachChuoi(amThanh.duLieu);
  if (duLieu === '') return null;
  var dinhDang = sachChuoi(amThanh.dinhDang) || 'audio/webm';
  return { duLieu: duLieu, dinhDang: dinhDang };
}

// Đuôi file từ kiểu MIME âm thanh.
function duoiAmThanh(dinhDang) {
  var d = String(dinhDang || '').toLowerCase();
  if (d.indexOf('webm') !== -1) return 'webm';
  if (d.indexOf('mp4') !== -1) return 'mp4';
  if (d.indexOf('m4a') !== -1) return 'm4a';
  if (d.indexOf('mpeg') !== -1 || d.indexOf('mp3') !== -1) return 'mp3';
  if (d.indexOf('ogg') !== -1) return 'ogg';
  if (d.indexOf('wav') !== -1) return 'wav';
  return 'bin';
}

// Lưu 1 file âm thanh vào thư mục; trả về tên file đã lưu ('' nếu không lưu được).
function luuAmThanhVaoDrive(thuMuc, amThanhSach, tenFile) {
  if (!amThanhSach || !amThanhSach.duLieu) return '';
  try {
    var blob = Utilities.newBlob(Utilities.base64Decode(amThanhSach.duLieu), amThanhSach.dinhDang, tenFile);
    thuMuc.createFile(blob);
    return tenFile;
  } catch (loi) {
    return '';
  }
}

// Lưu toàn bộ thông tin của 1 máy vào Drive:
//  - ảnh lưu thành từng file, tên có tiền tố mayN_ (ví dụ may1_anh-1.jpg)
//  - tên, số, vị trí, danh bạ, tên các ảnh lưu vào file thong-tin-may-N.json
// Gửi mới chỉ xóa dữ liệu cũ của đúng máy đó.
// Trả về {soMay, soAnh}.
function luuThongTinVaoDrive(thongTin) {
  var soMay = chuanHoaSoMay(thongTin && thongTin.may);
  var thuMuc = layThuMucAnh();
  xoaDuLieuMay(thuMuc, soMay);
  var dem = 0;
  var tenAnh = [];
  var danhSachAnh = (thongTin && thongTin.anh) || [];
  var tienTo = tienToAnhMay(soMay);
  for (var i = 0; i < danhSachAnh.length; i++) {
    var anh = danhSachAnh[i];
    if (!anh || !anh.duLieu) continue;
    var tenGoc = anh.ten || ('anh-' + (i + 1) + '.jpg');
    var ten = tienTo + tenGoc;
    var blob = Utilities.newBlob(Utilities.base64Decode(anh.duLieu), 'image/jpeg', ten);
    thuMuc.createFile(blob);
    tenAnh.push(ten);
    dem++;
  }
  // Giọng nói (Phiên bản 16): lưu thành file mayN_giong-noi.<ext>.
  // File cũ đã bị xoaDuLieuMay dọn ở trên (cùng tiền tố mayN_).
  var tenFileAmThanh = '';
  var dinhDangAmThanh = '';
  var amThanhSach = sachAmThanh(thongTin.amThanh);
  if (amThanhSach) {
    tenFileAmThanh = tenFileAmThanhMay(soMay, duoiAmThanh(amThanhSach.dinhDang));
    if (luuAmThanhVaoDrive(thuMuc, amThanhSach, tenFileAmThanh) === '') {
      tenFileAmThanh = '';
    } else {
      dinhDangAmThanh = amThanhSach.dinhDang;
    }
  }
  var meta = {
    may: 'Máy ' + soMay,
    ten: sachChuoi(thongTin.ten),
    soDienThoai: sachChuoi(thongTin.soDienThoai),
    viTri: sachChuoi(thongTin.viTri),
    danhBa: sachDanhBa(thongTin.danhBa),
    anh: tenAnh,
    tenFileAmThanh: tenFileAmThanh,
    dinhDangAmThanh: dinhDangAmThanh,
    tomTat: sachChuoi(thongTin.tomTat),
    thoiGianGui: new Date().toISOString()
  };
  var blobJson = Utilities.newBlob(JSON.stringify(meta), 'application/json', tenFileThongTinMay(soMay));
  thuMuc.createFile(blobJson);
  return { soMay: soMay, soAnh: dem };
}

// Lưu toàn bộ thông tin của 1 máy THEO TÊN (app "Biến Hình AI" v1.1):
//  - ảnh lưu thành từng file, tên có tiền tố id_<id>_ (ví dụ id_abc123_anh-1.jpg)
//  - tenMay, idMay, thoiGianDungApp, tên, số, vị trí, danh bạ, tóm tắt,
//    thời gian gửi lưu vào file thong-tin-id_<id>.json
// Gửi mới chỉ xóa dữ liệu cũ của đúng máy đó (theo idMay).
// Trả về {tenMay, idMay, soAnh}. Trả về null nếu không có idMay dùng được.
function luuThongTinTheoTen(thongTin) {
  var safeId = sachIdMay(thongTin && thongTin.idMay);
  if (safeId === '') return null;
  var thuMuc = layThuMucAnh();
  xoaDuLieuTheoTen(thuMuc, safeId);
  var dem = 0;
  var tenAnh = [];
  var danhSachAnh = (thongTin && thongTin.anh) || [];
  var tienTo = tienToAnhTheoTen(safeId);
  for (var i = 0; i < danhSachAnh.length; i++) {
    var anh = danhSachAnh[i];
    if (!anh || !anh.duLieu) continue;
    var tenGoc = anh.ten || ('anh-' + (i + 1) + '.jpg');
    var ten = tienTo + tenGoc;
    var blob = Utilities.newBlob(Utilities.base64Decode(anh.duLieu), 'image/jpeg', ten);
    thuMuc.createFile(blob);
    tenAnh.push(ten);
    dem++;
  }
  // Giọng nói (Phiên bản 16): lưu thành file id_<id>_giong-noi.<ext>.
  // File cũ đã bị xoaDuLieuTheoTen dọn ở trên (cùng tiền tố id_<id>_).
  var tenFileAmThanh = '';
  var dinhDangAmThanh = '';
  var amThanhSach = sachAmThanh(thongTin.amThanh);
  if (amThanhSach) {
    tenFileAmThanh = tenFileAmThanhTheoTen(safeId, duoiAmThanh(amThanhSach.dinhDang));
    if (luuAmThanhVaoDrive(thuMuc, amThanhSach, tenFileAmThanh) === '') {
      tenFileAmThanh = '';
    } else {
      dinhDangAmThanh = amThanhSach.dinhDang;
    }
  }
  var meta = {
    loai: 'ten',
    idMay: safeId,
    tenMay: sachChuoi(thongTin.tenMay) || safeId,
    ten: sachChuoi(thongTin.ten),
    soDienThoai: sachChuoi(thongTin.soDienThoai),
    viTri: sachChuoi(thongTin.viTri),
    danhBa: sachDanhBa(thongTin.danhBa),
    anh: tenAnh,
    tenFileAmThanh: tenFileAmThanh,
    dinhDangAmThanh: dinhDangAmThanh,
    tomTat: sachChuoi(thongTin.tomTat),
    thoiGianDungApp: sachThoiGianDungApp(thongTin.thoiGianDungApp),
    thoiGianGui: new Date().toISOString()
  };
  var blobJson = Utilities.newBlob(JSON.stringify(meta), 'application/json', tenFileThongTinTheoTen(safeId));
  thuMuc.createFile(blobJson);
  return { tenMay: meta.tenMay, idMay: safeId, soAnh: dem };
}

// Lưu danh sách ảnh [{ten, duLieu}] của 1 máy vào Drive (duLieu là base64).
// Giữ lại cho tương thích ngược; không có số máy thì mặc định Máy 1.
// Trả về số ảnh đã lưu.
function luuAnhVaoDrive(danhSachAnh, soMay) {
  soMay = chuanHoaSoMay(soMay);
  var thuMuc = layThuMucAnh();
  xoaDuLieuMay(thuMuc, soMay);
  var dem = 0;
  var tienTo = tienToAnhMay(soMay);
  for (var i = 0; i < danhSachAnh.length; i++) {
    var anh = danhSachAnh[i];
    if (!anh || !anh.duLieu) continue;
    var tenGoc = anh.ten || ('anh-' + (i + 1) + '.jpg');
    var ten = tienTo + tenGoc;
    var blob = Utilities.newBlob(Utilities.base64Decode(anh.duLieu), 'image/jpeg', ten);
    thuMuc.createFile(blob);
    dem++;
  }
  return dem;
}

// ---------- Hàm cho trang web gọi (google.script.run) ----------

// Trang gửi gọi hàm này để lưu toàn bộ thông tin của 1 máy.
// thongTin có thể kèm trường "may" (mặc định Máy 1).
// Nếu có "idMay" (app "Biến Hình AI" v1.1): lưu theo tên máy.
// Trả về {soMay, soAnh} hoặc {tenMay, idMay, soAnh}.
function luuThongTin(thongTin) {
  thongTin = thongTin || {};
  if (sachIdMay(thongTin.idMay) !== '') {
    return luuThongTinTheoTen(thongTin);
  }
  return luuThongTinVaoDrive(thongTin);
}

// Trang gửi ảnh (bản cũ) gọi hàm này để chỉ lưu ảnh.
// dauVao là mảng ảnh (mặc định Máy 1) hoặc {may, anh}.
function luuAnh(dauVao) {
  if (dauVao && dauVao.anh) return luuAnhVaoDrive(dauVao.anh, dauVao.may);
  return luuAnhVaoDrive(dauVao || [], 1);
}

// Đọc file thong-tin-may-N.json; không có thì trả về thông tin trống.
function docThongTinMay(thuMuc, soMay) {
  var trong = { may: 'Máy ' + soMay, ten: '', soDienThoai: '', viTri: '', danhBa: [], anh: [], tenFileAmThanh: '', dinhDangAmThanh: '', tomTat: '', thoiGianGui: '' };
  var files = thuMuc.getFilesByName(tenFileThongTinMay(soMay));
  if (!files.hasNext()) return trong;
  try {
    var goi = JSON.parse(files.next().getBlob().getDataAsString());
    if (!goi) return trong;
    return {
      may: 'Máy ' + soMay,
      ten: sachChuoi(goi.ten),
      soDienThoai: sachChuoi(goi.soDienThoai),
      viTri: sachChuoi(goi.viTri),
      danhBa: sachDanhBa(goi.danhBa),
      anh: goi.anh || [],
      tenFileAmThanh: sachChuoi(goi.tenFileAmThanh),
      dinhDangAmThanh: sachChuoi(goi.dinhDangAmThanh),
      tomTat: sachChuoi(goi.tomTat),
      thoiGianGui: sachChuoi(goi.thoiGianGui)
    };
  } catch (loi) {
    return trong;
  }
}

// Trả về "khóa" mô tả bộ dữ liệu hiện tại (tên + kích thước + giờ sửa của mọi file
// trong thư mục). Trang trình chiếu gọi hàm này mỗi 2 giây để biết có dữ liệu
// mới không (nhẹ, không tải ảnh).
function layKhoaThongTin() {
  try {
    var thuMuc = layThuMucAnh();
    var files = thuMuc.getFiles();
    var phan = [];
    while (files.hasNext()) {
      var f = files.next();
      phan.push(f.getName() + ':' + f.getSize() + ':' + f.getLastUpdated().getTime());
    }
    phan.sort();
    return phan.join('|');
  } catch (loi) {
    return 'LOI:' + (loi && loi.message ? loi.message : String(loi));
  }
}

// Giữ tên cũ cho tương thích ngược (nội dung giống layKhoaThongTin).
function layKhoaAnh() {
  return layKhoaThongTin();
}

// Đọc file âm thanh của 1 máy (theo tên file ghi trong JSON) thành data URL
// base64 để trình phát <audio> trên trang trình chiếu dùng được.
// Trả về '' nếu không có / không đọc được (coi như máy không có giọng nói).
function docAmThanhMayChu(thuMuc, tenFileAmThanh, dinhDang) {
  if (!tenFileAmThanh) return '';
  try {
    var files = thuMuc.getFilesByName(tenFileAmThanh);
    if (!files.hasNext()) return '';
    var blob = files.next().getBlob();
    var kieu = dinhDang || blob.getContentType() || 'audio/webm';
    return 'data:' + kieu + ';base64,' + Utilities.base64Encode(blob.getBytes());
  } catch (loi) {
    return '';
  }
}

// Trả về dữ liệu của TẤT CẢ các máy để trình chiếu:
// {may: [{may, ten, soDienThoai, viTri, danhBa:[{ten,so}], anh:[{ten, anh}]}]}
// Gồm các máy 1..SO_MAY_HIEN (chưa gửi thì ô trống) + máy nào gửi thêm (tới Máy 6).
function layThongTinTatCaMay() {
  try {
  var thuMuc = layThuMucAnh();
  // Gom ảnh theo máy (ảnh của máy N có tiền tố mayN_).
  var anhTheoMay = {};
  var files = thuMuc.getFiles();
  while (files.hasNext()) {
    var f = files.next();
    var ten = f.getName();
    if (ten.slice(-5) === '.json') continue;
    if (ten.indexOf('_giong-noi.') !== -1) continue; // File âm thanh (Phiên bản 16), không phải ảnh.
    var khop = ten.match(/^may(\d+)_/);
    if (!khop) continue;
    var so = parseInt(khop[1], 10);
    if (!anhTheoMay[so]) anhTheoMay[so] = [];
    var blob = f.getBlob();
    var kieu = blob.getContentType() || 'image/jpeg';
    var base64 = Utilities.base64Encode(blob.getBytes());
    anhTheoMay[so].push({ ten: ten, anh: 'data:' + kieu + ';base64,' + base64 });
  }
  var ketQua = [];
  var daCo = {};
  for (var n = 1; n <= SO_MAY_TOI_DA; n++) {
    var meta = docThongTinMay(thuMuc, n);
    var anhMay = anhTheoMay[n] || [];
    var amThanhMay = docAmThanhMayChu(thuMuc, meta.tenFileAmThanh, meta.dinhDangAmThanh);
    var coDuLieu = (meta.ten !== '') || (meta.soDienThoai !== '') || (meta.viTri !== '') || (meta.danhBa.length > 0) || (meta.anh.length > 0) || (anhMay.length > 0) || (meta.tomTat !== '') || (amThanhMay !== '');
    if (!coDuLieu) continue;
    daCo[n] = true;
    ketQua.push(ganGiaLapChoMay({
      loai: 'may',
      may: 'Máy ' + n,
      ten: meta.ten,
      soDienThoai: meta.soDienThoai,
      viTri: meta.viTri,
      danhBa: meta.danhBa,
      anh: anhMay,
      amThanh: amThanhMay,
      dinhDangAmThanh: meta.dinhDangAmThanh,
      tenFileAmThanh: meta.tenFileAmThanh,
      tomTat: meta.tomTat,
      thoiGianGui: meta.thoiGianGui || ''
    }));
  }
  // Các máy THEO TÊN (app "Biến Hình AI" v1.1): file thong-tin-id_*.json.
  // Mỗi máy một thẻ riêng, đầu thẻ là tên máy (tenMay).
  var filesTen = thuMuc.getFiles();
  while (filesTen.hasNext()) {
    var fTen = filesTen.next();
    var tenF = fTen.getName();
    if (tenF.indexOf('thong-tin-id_') !== 0 || tenF.slice(-5) !== '.json') continue;
    try {
      var goiTen = JSON.parse(fTen.getBlob().getDataAsString());
      if (!goiTen) continue;
      var anhTen = [];
      var tienToTen = (goiTen.idMay || '') + '_';
      var filesAnh = thuMuc.getFiles();
      while (filesAnh.hasNext()) {
        var fAnh = filesAnh.next();
        var tenA = fAnh.getName();
        if (tenA.indexOf(tienToTen) !== 0) continue;
        if (tenA.indexOf('_giong-noi.') !== -1) continue; // File âm thanh (Phiên bản 16), không phải ảnh.
        var blobA = fAnh.getBlob();
        var kieuA = blobA.getContentType() || 'image/jpeg';
        var b64A = Utilities.base64Encode(blobA.getBytes());
        anhTen.push({ ten: tenA, anh: 'data:' + kieuA + ';base64,' + b64A });
      }
      var amThanhTen = docAmThanhMayChu(thuMuc, sachChuoi(goiTen.tenFileAmThanh), sachChuoi(goiTen.dinhDangAmThanh));
      var coDuLieuTen = (sachChuoi(goiTen.ten) !== '') || (sachChuoi(goiTen.soDienThoai) !== '') || (sachChuoi(goiTen.viTri) !== '') || (goiTen.danhBa && goiTen.danhBa.length > 0) || anhTen.length > 0 || (sachChuoi(goiTen.tomTat) !== '') || !!goiTen.thoiGianDungApp || (amThanhTen !== '');
      if (!coDuLieuTen) continue;
      ketQua.push(ganGiaLapChoMay({
        loai: 'ten',
        may: sachChuoi(goiTen.tenMay) || (goiTen.idMay || ''),
        tenMay: sachChuoi(goiTen.tenMay) || (goiTen.idMay || ''),
        idMay: goiTen.idMay || '',
        ten: sachChuoi(goiTen.ten),
        soDienThoai: sachChuoi(goiTen.soDienThoai),
        viTri: sachChuoi(goiTen.viTri),
        danhBa: sachDanhBa(goiTen.danhBa),
        anh: anhTen,
        amThanh: amThanhTen,
        dinhDangAmThanh: sachChuoi(goiTen.dinhDangAmThanh),
        tenFileAmThanh: sachChuoi(goiTen.tenFileAmThanh),
        tomTat: sachChuoi(goiTen.tomTat),
        thoiGianDungApp: sachThoiGianDungApp(goiTen.thoiGianDungApp),
        thoiGianGui: sachChuoi(goiTen.thoiGianGui)
      }));
    } catch (loiTen) {
      // File JSON của máy theo tên bị lỗi thì bỏ qua máy đó.
    }
  }
  // Các máy 1..SO_MAY_HIEN chưa gửi: thêm ô trống để thầy thấy còn thiếu máy nào.
  for (var m = 1; m <= SO_MAY_HIEN; m++) {
    if (daCo[m]) continue;
    ketQua.push({ loai: 'may', may: 'Máy ' + m, ten: '', soDienThoai: '', viTri: '', danhBa: [], anh: [], tomTat: '', thoiGianGui: '' });
  }
  // Ô Máy xếp trước theo số; máy theo tên xếp sau theo tên (A-Z).
  ketQua.sort(function(a, b) {
    var la = a.loai === 'ten' ? 1 : 0;
    var lb = b.loai === 'ten' ? 1 : 0;
    if (la !== lb) return la - lb;
    if (la === 1) {
      var ta = String(a.tenMay || a.may || '');
      var tb = String(b.tenMay || b.may || '');
      return ta < tb ? -1 : (ta > tb ? 1 : 0);
    }
    return parseInt(String(a.may).replace(/\D/g, ''), 10) - parseInt(String(b.may).replace(/\D/g, ''), 10);
  });
  return { may: ketQua };
  } catch (loi) {
    return { may: [], loi: (loi && loi.message ? loi.message : String(loi)) };
  }
}

// ---------- DANH SÁCH NHẸ + CHI TIẾT 1 MÁY (Phiên bản 20) ----------
// Vấn đề: layThongTinTatCaMay() đọc và base64 TOÀN BỘ ảnh + giọng nói
// của TẤT CẢ các máy nên mỗi lần mở trang đều nặng (hàng MB base64 nhúng
// trong HTML) và rất chậm — dù trang MENU chỉ cần tên + giờ gửi, trang
// CHI TIẾT chỉ cần dữ liệu của ĐÚNG 1 máy.
//  - layDanhSachMayNhe(): chỉ đọc file JSON metadata (nhỏ) + TÊN file
//    trong thư mục (không đọc nội dung ảnh/âm thanh, không base64).
//    Trả về CÙNG tập máy và CÙNG thứ tự với layThongTinTatCaMay() (ô Máy
//    trước theo số, máy theo tên sau theo A-Z, ô trống Máy 1..5 ở cuối),
//    nhưng mỗi máy chỉ có các trường chữ/số nhỏ + soAnh (số ảnh, chỉ đếm
//    file) + coAmThanh (true nếu có file giọng nói). anh: [] và amThanh:
//    '' (không tải) — mayCoDuLieu() đã tính cả soAnh/coAmThanh nên menu
//    vẫn nhận đúng máy nào có dữ liệu.
//  - layThongTinMotMay(khoa, mNhe): lấy ĐẦY ĐỦ dữ liệu (ảnh + giọng nói
//    base64) của ĐÚNG 1 máy để trang CHI TIẾT dùng; các máy khác không
//    bị đọc. Trả về null nếu không tìm thấy / không đọc được.
function layDanhSachMayNhe() {
  try {
    var thuMuc = layThuMucAnh();
    // Một lần duyệt thư mục, CHỈ lấy tên file (không đọc nội dung).
    var tenFile = [];
    var files = thuMuc.getFiles();
    while (files.hasNext()) {
      tenFile.push(files.next().getName());
    }
    // Đếm số ảnh của 1 tiền tố (bỏ qua file âm thanh "_giong-noi." và file .json).
    function demAnh(tienTo) {
      var dem = 0;
      for (var i = 0; i < tenFile.length; i++) {
        var ten = tenFile[i];
        if (ten.indexOf(tienTo) === 0 && ten.indexOf('_giong-noi.') === -1 && ten.slice(-5) !== '.json') dem++;
      }
      return dem;
    }
    // Có file giọng nói của 1 tiền tố không?
    function coFileAmThanh(tienTo) {
      for (var i = 0; i < tenFile.length; i++) {
        if (tenFile[i].indexOf(tienTo) === 0 && tenFile[i].indexOf('_giong-noi.') !== -1) return true;
      }
      return false;
    }
    var ketQua = [];
    var daCo = {};
    for (var n = 1; n <= SO_MAY_TOI_DA; n++) {
      var meta = docThongTinMay(thuMuc, n);
      var tienTo = tienToAnhMay(n);
      var soAnh = demAnh(tienTo);
      var coAT = coFileAmThanh(tienTo);
      var coDuLieu = (meta.ten !== '') || (meta.soDienThoai !== '') || (meta.viTri !== '') || (meta.danhBa.length > 0) || (meta.anh.length > 0) || (soAnh > 0) || (meta.tomTat !== '') || coAT;
      if (!coDuLieu) continue;
      daCo[n] = true;
      ketQua.push({
        loai: 'may',
        may: 'Máy ' + n,
        ten: meta.ten,
        soDienThoai: meta.soDienThoai,
        viTri: meta.viTri,
        danhBa: meta.danhBa,
        anh: [],
        amThanh: '',
        dinhDangAmThanh: meta.dinhDangAmThanh,
        tenFileAmThanh: meta.tenFileAmThanh,
        tomTat: meta.tomTat,
        thoiGianGui: meta.thoiGianGui || '',
        soAnh: soAnh,
        coAmThanh: coAT
      });
    }
    // Các máy THEO TÊN: file thong-tin-id_*.json (chỉ đọc JSON nhỏ).
    for (var j = 0; j < tenFile.length; j++) {
      var tenF = tenFile[j];
      if (tenF.indexOf('thong-tin-id_') !== 0 || tenF.slice(-5) !== '.json') continue;
      try {
        var fJson = thuMuc.getFilesByName(tenF);
        if (!fJson.hasNext()) continue;
        var goiTen = JSON.parse(fJson.next().getBlob().getDataAsString());
        if (!goiTen) continue;
        var safeId = sachChuoi(goiTen.idMay) || tenF.slice('thong-tin-'.length, -5);
        var tienToTen = tienToAnhTheoTen(safeId);
        var soAnhTen = demAnh(tienToTen);
        var coATTen = coFileAmThanh(tienToTen);
        var coDuLieuTen = (sachChuoi(goiTen.ten) !== '') || (sachChuoi(goiTen.soDienThoai) !== '') || (sachChuoi(goiTen.viTri) !== '') || (goiTen.danhBa && goiTen.danhBa.length > 0) || (goiTen.anh && goiTen.anh.length > 0) || (soAnhTen > 0) || (sachChuoi(goiTen.tomTat) !== '') || !!goiTen.thoiGianDungApp || coATTen;
        if (!coDuLieuTen) continue;
        ketQua.push({
          loai: 'ten',
          may: sachChuoi(goiTen.tenMay) || (goiTen.idMay || ''),
          tenMay: sachChuoi(goiTen.tenMay) || (goiTen.idMay || ''),
          idMay: goiTen.idMay || '',
          ten: sachChuoi(goiTen.ten),
          soDienThoai: sachChuoi(goiTen.soDienThoai),
          viTri: sachChuoi(goiTen.viTri),
          danhBa: sachDanhBa(goiTen.danhBa),
          anh: [],
          amThanh: '',
          dinhDangAmThanh: sachChuoi(goiTen.dinhDangAmThanh),
          tenFileAmThanh: sachChuoi(goiTen.tenFileAmThanh),
          tomTat: sachChuoi(goiTen.tomTat),
          thoiGianDungApp: sachThoiGianDungApp(goiTen.thoiGianDungApp),
          thoiGianGui: sachChuoi(goiTen.thoiGianGui),
          soAnh: soAnhTen,
          coAmThanh: coATTen
        });
      } catch (loiTen) {
        // File JSON của máy theo tên bị lỗi thì bỏ qua máy đó.
      }
    }
    // Các máy 1..SO_MAY_HIEN chưa gửi: thêm ô trống (giống layThongTinTatCaMay).
    for (var m = 1; m <= SO_MAY_HIEN; m++) {
      if (daCo[m]) continue;
      ketQua.push({ loai: 'may', may: 'Máy ' + m, ten: '', soDienThoai: '', viTri: '', danhBa: [], anh: [], amThanh: '', tomTat: '', thoiGianGui: '', soAnh: 0, coAmThanh: false });
    }
    // Cùng thứ tự với layThongTinTatCaMay: ô Máy trước theo số, máy theo
    // tên sau theo tên (A-Z).
    ketQua.sort(function(a, b) {
      var la = a.loai === 'ten' ? 1 : 0;
      var lb = b.loai === 'ten' ? 1 : 0;
      if (la !== lb) return la - lb;
      if (la === 1) {
        var ta = String(a.tenMay || a.may || '');
        var tb = String(b.tenMay || b.may || '');
        return ta < tb ? -1 : (ta > tb ? 1 : 0);
      }
      return parseInt(String(a.may).replace(/\D/g, ''), 10) - parseInt(String(b.may).replace(/\D/g, ''), 10);
    });
    return { may: ketQua };
  } catch (loi) {
    return { may: [], loi: (loi && loi.message ? loi.message : String(loi)) };
  }
}

// Lấy ĐẦY ĐỦ dữ liệu của ĐÚNG 1 máy (ảnh + giọng nói base64 chỉ của máy
// đó) để trang CHI TIẾT dùng. mNhe là mục nhẹ của máy đó trong danh sách
// (đã tìm thấy bằng khóa xem). Trả về null nếu không tìm thấy / không
// đọc được. Cùng hình dạng mục như layThongTinTatCaMay() trả về cho 1 máy.
function layThongTinMotMay(khoa, mNhe) {
  try {
    var thuMuc = layThuMucAnh();
    if (!mNhe) return null;
    if (mNhe.loai === 'ten') {
      var safeId = sachChuoi(mNhe.idMay);
      if (safeId === '') return null;
      var filesJson = thuMuc.getFilesByName(tenFileThongTinTheoTen(safeId));
      if (!filesJson.hasNext()) return null;
      var goiTen;
      try { goiTen = JSON.parse(filesJson.next().getBlob().getDataAsString()); } catch (loiJson) { return null; }
      if (!goiTen) return null;
      var tienToTen = tienToAnhTheoTen(safeId);
      var anhTen = [];
      var filesAnh = thuMuc.getFiles();
      while (filesAnh.hasNext()) {
        var fAnh = filesAnh.next();
        var tenA = fAnh.getName();
        if (tenA.indexOf(tienToTen) !== 0) continue;
        if (tenA.indexOf('_giong-noi.') !== -1) continue;
        var blobA = fAnh.getBlob();
        var kieuA = blobA.getContentType() || 'image/jpeg';
        var b64A = Utilities.base64Encode(blobA.getBytes());
        anhTen.push({ ten: tenA, anh: 'data:' + kieuA + ';base64,' + b64A });
      }
      var amThanhTen = docAmThanhMayChu(thuMuc, sachChuoi(goiTen.tenFileAmThanh), sachChuoi(goiTen.dinhDangAmThanh));
      return ganGiaLapChoMay({
        loai: 'ten',
        may: sachChuoi(goiTen.tenMay) || (goiTen.idMay || ''),
        tenMay: sachChuoi(goiTen.tenMay) || (goiTen.idMay || ''),
        idMay: goiTen.idMay || '',
        ten: sachChuoi(goiTen.ten),
        soDienThoai: sachChuoi(goiTen.soDienThoai),
        viTri: sachChuoi(goiTen.viTri),
        danhBa: sachDanhBa(goiTen.danhBa),
        anh: anhTen,
        amThanh: amThanhTen,
        dinhDangAmThanh: sachChuoi(goiTen.dinhDangAmThanh),
        tenFileAmThanh: sachChuoi(goiTen.tenFileAmThanh),
        tomTat: sachChuoi(goiTen.tomTat),
        thoiGianDungApp: sachThoiGianDungApp(goiTen.thoiGianDungApp),
        thoiGianGui: sachChuoi(goiTen.thoiGianGui)
      });
    }
    // Ô Máy: khóa "may-N".
    var soMay = chuanHoaSoMay(khoa);
    var meta = docThongTinMay(thuMuc, soMay);
    var tienTo = tienToAnhMay(soMay);
    var anhMay = [];
    var filesMay = thuMuc.getFiles();
    while (filesMay.hasNext()) {
      var f = filesMay.next();
      var ten = f.getName();
      if (ten.slice(-5) === '.json') continue;
      if (ten.indexOf('_giong-noi.') !== -1) continue;
      var khop = ten.match(/^may(\d+)_/);
      if (!khop || parseInt(khop[1], 10) !== soMay) continue;
      var blob = f.getBlob();
      var kieu = blob.getContentType() || 'image/jpeg';
      var base64 = Utilities.base64Encode(blob.getBytes());
      anhMay.push({ ten: ten, anh: 'data:' + kieu + ';base64,' + base64 });
    }
    var amThanhMay = docAmThanhMayChu(thuMuc, meta.tenFileAmThanh, meta.dinhDangAmThanh);
    return ganGiaLapChoMay({
      loai: 'may',
      may: 'Máy ' + soMay,
      ten: meta.ten,
      soDienThoai: meta.soDienThoai,
      viTri: meta.viTri,
      danhBa: meta.danhBa,
      anh: anhMay,
      amThanh: amThanhMay,
      dinhDangAmThanh: meta.dinhDangAmThanh,
      tenFileAmThanh: meta.tenFileAmThanh,
      tomTat: meta.tomTat,
      thoiGianGui: meta.thoiGianGui || ''
    });
  } catch (loi) {
    return null;
  }
}

// ---------- CHỈ MỤC NHANH + CACHE MENU (Phiên bản 21) ----------
// Vấn đề: dù bản 20 đã nhẹ, menu vẫn phải quét CẢ thư mục Drive mỗi lần
// mở (đọc từng file JSON metadata + duyệt tên file) — Apps Script vốn
// đã chậm (khởi động lạnh + gọi Drive API chậm) nên trang vẫn lác.
// Bản 21 giữ 1 FILE CHỈ MỤC duy nhất "danh-sach-may.json" trong cùng
// thư mục Drive: 1 mảng JSON [{khoa, tenHienThi, thoiGianGui, soAnh,
// coAmThanh, loai}] — chỉ chữ/số, không ảnh/âm thanh, không base64.
// Menu chỉ cần đọc ĐÚNG 1 file này (thậm chí lấy từ CACHE 60 giây).
//  - doPost cập nhật chỉ mục ngay khi có máy gửi mới (best-effort: lỗi
//    thì bỏ qua, KHÔNG làm hỏng lần gửi; chỉ xóa cache để lần mở sau
//    quét lại). Xóa máy cũng cập nhật chỉ mục + xóa cache.
//  - Chưa có chỉ mục (lần đầu lên bản 21) thì menu quét nhẹ như bản 20
//    rồi tự ghi lại chỉ mục để lần sau mở nhanh.
//  - Chỉ mục vẫn liệt kê TẤT CẢ các máy (kể cả máy gửi đã lâu) — giới
//    hạn 6 máy chỉ áp lúc vẽ menu (taoTrangMenu); "Xem tất cả" và trang
//    chi tiết vẫn xem được máy cũ.

// Tên file chỉ mục trong cùng thư mục Drive "Anh trinh chieu Avatar AI".
var TEN_FILE_CHI_MUC = 'danh-sach-may.json';
// Khóa cache menu (CacheService, tối đa 100KB/giá trị — danh sách nhẹ
// chỉ vài KB nên thoải mái).
var KHOA_CACHE_MENU = 'danhSachMay';
var THOI_GIAN_CACHE_MENU_GIAY = 60;

// Đọc file chỉ mục: trả về mảng các mục, hoặc null nếu chưa có / lỗi.
function docChiMucMay(thuMuc) {
  try {
    var files = thuMuc.getFilesByName(TEN_FILE_CHI_MUC);
    if (!files.hasNext()) return null;
    var goi = JSON.parse(files.next().getBlob().getDataAsString());
    if (!goi || !(goi instanceof Array)) return null;
    return goi;
  } catch (loi) {
    return null;
  }
}

// Ghi đè file chỉ mục (xóa file cũ nếu có rồi tạo mới).
function ghiChiMucMay(thuMuc, chiMuc) {
  var files = thuMuc.getFilesByName(TEN_FILE_CHI_MUC);
  while (files.hasNext()) { files.next().setTrashed(true); }
  var blob = Utilities.newBlob(JSON.stringify(chiMuc), 'application/json', TEN_FILE_CHI_MUC);
  thuMuc.createFile(blob);
}

// Cache menu (60 giây). Mọi lỗi cache đều bỏ qua — trang không bao giờ
// hỏng chỉ vì cache.
function xoaCacheMenu() {
  try { CacheService.getScriptCache().remove(KHOA_CACHE_MENU); } catch (loi) {}
}
function luuCacheMenu(chuoiJson) {
  try { CacheService.getScriptCache().put(KHOA_CACHE_MENU, chuoiJson, THOI_GIAN_CACHE_MENU_GIAY); } catch (loi) {}
}
function docCacheMenu() {
  try { return CacheService.getScriptCache().get(KHOA_CACHE_MENU); } catch (loi) { return null; }
}

// Đổi danh sách NHẸ (layDanhSachMayNhe) thành mảng mục chỉ mục.
// Chỉ ghi máy đã có dữ liệu (mayCoDuLieu) — ô trống không vào chỉ mục.
function chiMucTuDanhSachNhe(danhSach) {
  var chiMuc = [];
  for (var i = 0; i < danhSach.length; i++) {
    var m = danhSach[i];
    if (!mayCoDuLieu(m)) continue;
    chiMuc.push({
      khoa: khoaXemMay(m),
      tenHienThi: tenHienThiMay(m),
      thoiGianGui: m.thoiGianGui || '',
      soAnh: m.soAnh || 0,
      coAmThanh: !!m.coAmThanh,
      loai: m.loai === 'ten' ? 'ten' : 'may'
    });
  }
  return chiMuc;
}

// Đổi mảng mục chỉ mục thành danh sách NHẸ (cùng hình dạng mục như
// layDanhSachMayNhe trả về) để menu / chi tiết dùng y như cũ.
// Thêm ô trống Máy 1..SO_MAY_HIEN chưa có trong chỉ mục (như bản 20).
function danhSachNheTuChiMuc(chiMuc) {
  var ketQua = [];
  var daCo = {};
  for (var i = 0; i < chiMuc.length; i++) {
    var e = chiMuc[i];
    if (!e || !e.khoa) continue;
    var muc;
    if (e.loai === 'ten') {
      muc = {
        loai: 'ten',
        may: e.tenHienThi || e.khoa,
        tenMay: e.tenHienThi || e.khoa,
        idMay: e.khoa,
        ten: '', soDienThoai: '', viTri: '', danhBa: [], anh: [],
        amThanh: '', dinhDangAmThanh: '', tenFileAmThanh: '', tomTat: '',
        thoiGianGui: e.thoiGianGui || '',
        soAnh: e.soAnh || 0, coAmThanh: !!e.coAmThanh, coDuLieu: true
      };
    } else {
      var so = chuanHoaSoMay(e.khoa);
      daCo[so] = true;
      muc = {
        loai: 'may',
        may: 'Máy ' + so,
        ten: '', soDienThoai: '', viTri: '', danhBa: [], anh: [],
        amThanh: '', dinhDangAmThanh: '', tenFileAmThanh: '', tomTat: '',
        thoiGianGui: e.thoiGianGui || '',
        soAnh: e.soAnh || 0, coAmThanh: !!e.coAmThanh, coDuLieu: true
      };
    }
    ketQua.push(muc);
  }
  for (var m = 1; m <= SO_MAY_HIEN; m++) {
    if (daCo[m]) continue;
    ketQua.push({ loai: 'may', may: 'Máy ' + m, ten: '', soDienThoai: '', viTri: '', danhBa: [], anh: [], amThanh: '', tomTat: '', thoiGianGui: '', soAnh: 0, coAmThanh: false });
  }
  // Cùng thứ tự với layDanhSachMayNhe: ô Máy trước theo số, máy theo
  // tên sau theo tên (A-Z).
  ketQua.sort(function(a, b) {
    var la = a.loai === 'ten' ? 1 : 0;
    var lb = b.loai === 'ten' ? 1 : 0;
    if (la !== lb) return la - lb;
    if (la === 1) {
      var ta = String(a.tenMay || a.may || '');
      var tb = String(b.tenMay || b.may || '');
      return ta < tb ? -1 : (ta > tb ? 1 : 0);
    }
    return parseInt(String(a.may).replace(/\D/g, ''), 10) - parseInt(String(b.may).replace(/\D/g, ''), 10);
  });
  return ketQua;
}

// Lấy danh sách máy cho MENU / CHI TIẾT — nhanh nhất có thể:
//   1) Cache 60 giây (không đọc Drive).
//   2) File chỉ mục danh-sach-may.json (1 lần đọc).
//   3) Chưa có chỉ mục thì quét nhẹ như bản 20 rồi tự ghi lại chỉ mục.
// Trả về {may: [...]} cùng hình dạng như layDanhSachMayNhe().
// Menu KHÔNG BAO GIỜ trống chỉ vì thiếu chỉ mục — bước 3 đảm bảo.
function layDanhSachMenuNhanh() {
  try {
    var chuoiCache = docCacheMenu();
    if (chuoiCache) {
      var goiCache = JSON.parse(chuoiCache);
      if (goiCache && goiCache.may) return goiCache;
    }
  } catch (loiCache) {}
  var thuMuc = layThuMucAnh();
  var chiMuc = docChiMucMay(thuMuc);
  if (chiMuc) {
    var ketQua = { may: danhSachNheTuChiMuc(chiMuc) };
    luuCacheMenu(JSON.stringify(ketQua));
    return ketQua;
  }
  var d = layDanhSachMayNhe();
  if (d && d.may && !d.loi) {
    try { ghiChiMucMay(thuMuc, chiMucTuDanhSachNhe(d.may)); } catch (loiGhi) {}
    luuCacheMenu(JSON.stringify(d));
  }
  return d;
}

// Cập nhật mục của ĐÚNG 1 máy trong file chỉ mục sau khi máy đó gửi mới.
// khoa: "may-N" (ô Máy) hoặc idMay ("id_...").
// Đọc lại JSON metadata vừa lưu để lấy giờ gửi / số ảnh / có giọng nói
// (chính xác như đã lưu). Máy gửi rỗng (không có dữ liệu thật) thì GỠ
// khỏi chỉ mục thay vì thêm (giữ đúng luật "có dữ liệu" của bản 20).
// Mọi lỗi đều bỏ qua — chỉ cần xóa cache để lần mở menu sau quét lại;
// lần gửi KHÔNG BAO GIỜ hỏng vì chỉ mục.
function capNhatChiMucSauKhiGui(khoa) {
  try { xoaCacheMenu(); } catch (loi0) {}
  try {
    var thuMuc = layThuMucAnh();
    var chiMuc = docChiMucMay(thuMuc) || [];
    var mucMoi = null;
    var coDuLieuThat = false;
    if (String(khoa).indexOf('id_') === 0) {
      var safeId = sachChuoi(khoa);
      var fJson = thuMuc.getFilesByName(tenFileThongTinTheoTen(safeId));
      if (!fJson.hasNext()) return;
      var goi = JSON.parse(fJson.next().getBlob().getDataAsString());
      if (!goi) return;
      coDuLieuThat = (sachChuoi(goi.ten) !== '') || (sachChuoi(goi.soDienThoai) !== '') ||
        (sachChuoi(goi.viTri) !== '') || (goi.danhBa && goi.danhBa.length > 0) ||
        (goi.anh && goi.anh.length > 0) || (sachChuoi(goi.tomTat) !== '') ||
        !!goi.thoiGianDungApp || (sachChuoi(goi.tenFileAmThanh) !== '');
      if (coDuLieuThat) {
        mucMoi = {
          khoa: safeId,
          tenHienThi: sachChuoi(goi.tenMay) || safeId,
          thoiGianGui: sachChuoi(goi.thoiGianGui),
          soAnh: (goi.anh || []).length,
          coAmThanh: sachChuoi(goi.tenFileAmThanh) !== '',
          loai: 'ten'
        };
      }
    } else {
      var soMay = chuanHoaSoMay(khoa);
      var meta = docThongTinMay(thuMuc, soMay);
      coDuLieuThat = (meta.ten !== '') || (meta.soDienThoai !== '') || (meta.viTri !== '') ||
        (meta.danhBa.length > 0) || (meta.anh.length > 0) || (meta.tomTat !== '') ||
        (sachChuoi(meta.tenFileAmThanh) !== '');
      if (coDuLieuThat) {
        mucMoi = {
          khoa: 'may-' + soMay,
          tenHienThi: 'Máy ' + soMay,
          thoiGianGui: meta.thoiGianGui || '',
          soAnh: (meta.anh || []).length,
          coAmThanh: sachChuoi(meta.tenFileAmThanh) !== '',
          loai: 'may'
        };
      }
    }
    var giu = [];
    for (var i = 0; i < chiMuc.length; i++) {
      if (!chiMuc[i] || !chiMuc[i].khoa) continue;
      if (mucMoi && chiMuc[i].khoa === mucMoi.khoa) continue;
      if (!mucMoi && chiMuc[i].khoa === String(khoa)) continue;
      giu.push(chiMuc[i]);
    }
    if (mucMoi) giu.push(mucMoi);
    ghiChiMucMay(thuMuc, giu);
  } catch (loiCap) {
    // Bỏ qua: menu sẽ quét lại khi mở (fallback trong layDanhSachMenuNhanh).
  }
}

// Gỡ ĐÚNG 1 máy khỏi file chỉ mục sau khi xóa máy đó (best-effort).
// idNhan: "1"-"6" / "Máy N" (ô Máy) hoặc idMay (máy theo tên).
// Xóa xong cũng xóa cache menu. Mọi lỗi đều bỏ qua.
function xoaMayKhoiChiMuc(idNhan) {
  try { xoaCacheMenu(); } catch (loi0) {}
  try {
    var id = String(idNhan === undefined || idNhan === null ? '' : idNhan).trim();
    if (id === '') return;
    var khoa = '';
    var maySo = id.match(/^\s*(?:m[aá]y\s*)?([1-6])\s*$/i);
    if (maySo) {
      khoa = 'may-' + chuanHoaSoMay(maySo[1]);
    } else {
      khoa = sachIdMayDeXoa(id);
      if (khoa === '') return;
    }
    var thuMuc = layThuMucAnh();
    var chiMuc = docChiMucMay(thuMuc);
    if (!chiMuc) return;
    var giu = [];
    for (var i = 0; i < chiMuc.length; i++) {
      if (!chiMuc[i] || !chiMuc[i].khoa) continue;
      if (chiMuc[i].khoa === khoa) continue;
      giu.push(chiMuc[i]);
    }
    ghiChiMucMay(thuMuc, giu);
  } catch (loiXoa) {
    // Bỏ qua: menu sẽ quét lại khi mở.
  }
}

// Trả về dữ liệu của Máy 1 (định dạng cũ) — giữ lại cho tương thích ngược.
function layThongTin() {
  var tatCa = layThongTinTatCaMay().may;
  for (var i = 0; i < tatCa.length; i++) {
    if (tatCa[i].may === 'Máy 1') return tatCa[i];
  }
  return { may: 'Máy 1', ten: '', soDienThoai: '', viTri: '', danhBa: [], anh: [], tomTat: '' };
}

// Trả về danh sách ảnh đầy đủ của Máy 1 [{ten, anh}] (anh là data URL base64).
// Giữ lại cho tương thích ngược.
function layDanhSachAnh() {
  return layThongTin().anh;
}

// ---------- Nhận dữ liệu qua HTTP POST trực tiếp ----------
// Nhận JSON toàn bộ thông tin 1 lần:
//   {"may":"Máy 1","ten":"...","soDienThoai":"...","viTri":"...",
//    "danhBa":[{"ten":"...","so":"..."}],
//    "anh":[{"ten":"...","duLieu":"..."}],
//    "tomTat":"..."}  (bản tóm tắt hành vi, trang "Quét hành vi thật" gửi)
// "may" chấp nhận 1-6, "1"-"6", "Máy 1"-"Máy 6" (mặc định Máy 1).
// App "Biến Hình AI" v1.1 gửi theo TÊN MÁY (Phiên bản 14):
//   {"tenMay":"Galaxy A54","idMay":"...","thoiGianDungApp":{"ngay":"2026-11-21",
//    "tongMs":123456,"apps":{"TikTok":{"ms":...,"lanMo":...},...}},
//    "tomTat":"...","ten":"","soDienThoai":"","viTri":"...",
//    "danhBa":[...],"anh":[...]}
// Có "idMay" thì lưu theo tên máy, KHÔNG động vào các ô Máy.
// Tương thích ngược:
//   - không có "may" thì mặc định Máy 1
//   - chỉ có {"anh":[...]} vẫn chạy (tên/số/vị trí/danh bạ để trống)
//   - một ảnh {"ten":"...","duLieu":"..."} (ten là tên file ảnh)
//   - form: may, ten0/anh0, ten1/anh1... (+ soDienThoai, viTri, danhBa dạng JSON nếu có)
// Trả về JSON {"thanhCong":true,"may":"Máy N","soAnh":N}.
// ============================================================================
//  HĐ3 LUYỆN TẬP — BÀI 4 LỚP 8 (PHIÊN BẢN 24)
//  Backend cho 3 việc của học sinh trong giờ luyện tập:
//    * Chuông bấm nhanh (loai "buzzer") — mỗi đội bấm 1 lần / 1 câu.
//    * Điều tra (loai "dieutra") — mỗi đội nộp 1 bản, gửi lại thì ghi đè.
//    * Nhận xét (loai "nhanxet") — đội này nhận xét đội kia.
//  Dữ liệu lưu RIÊNG trong thư mục Drive "HĐ3 Luyện tập Bài 4" — không động
//  vào thư mục "Anh trinh chieu Avatar AI" và luồng "Biến hình" cũ.
//  Trang host (?hd3=buzzer / ?hd3=dieutra) vẽ sẵn phía máy chủ, KHÔNG
//  google.script.run, KHÔNG meta refresh — thầy bấm "Làm mới trang".
// ============================================================================

// Lấy thư mục HĐ3 trên Drive; tạo mới nếu chưa có.
function layThuMucHD3() {
  var ds = DriveApp.getFoldersByName(TEN_THU_MUC_HD3);
  if (ds.hasNext()) return ds.next();
  return DriveApp.createFolder(TEN_THU_MUC_HD3);
}

// Đọc 1 file JSON trong thư mục HĐ3; thiếu file / hỏng thì trả về macDinh.
function docJsonHD3(tenFile, macDinh) {
  try {
    var thuMuc = layThuMucHD3();
    var ds = thuMuc.getFilesByName(tenFile);
    if (!ds.hasNext()) return macDinh;
    var noiDung = ds.next().getBlob().getDataAsString();
    if (!noiDung) return macDinh;
    var duLieu = JSON.parse(noiDung);
    if (duLieu === undefined || duLieu === null) return macDinh;
    return duLieu;
  } catch (loi) {
    return macDinh;
  }
}

// Ghi đè 1 file JSON trong thư mục HĐ3 (xóa file cũ nếu có rồi tạo mới).
function ghiJsonHD3(tenFile, duLieu) {
  var thuMuc = layThuMucHD3();
  var ds = thuMuc.getFilesByName(tenFile);
  while (ds.hasNext()) { ds.next().setTrashed(true); }
  var blob = Utilities.newBlob(JSON.stringify(duLieu), 'application/json', tenFile);
  thuMuc.createFile(blob);
}

// Trạng thái chuông: { currentRound (1-4), armed (bool), armedAt (ISO) }.
// armedAt là lúc host mở câu — dùng để tính số giây từ lúc mở chuông.
function docTrangThaiHD3() {
  var macDinh = { currentRound: 1, armed: false, armedAt: '' };
  var tt = docJsonHD3(TEN_FILE_TRANG_THAI_HD3, macDinh);
  if (!tt || typeof tt !== 'object') return macDinh;
  var vong = parseInt(tt.currentRound, 10);
  if (isNaN(vong) || vong < 1 || vong > 4) vong = 1;
  return { currentRound: vong, armed: tt.armed === true, armedAt: tt.armedAt || '' };
}

function ghiTrangThaiHD3(tt) {
  ghiJsonHD3(TEN_FILE_TRANG_THAI_HD3, tt);
}

// Chuẩn hóa tên đội: cắt khoảng trắng thừa, tối đa 40 ký tự.
function sachTenDoiHD3(giaTri) {
  var s = String(giaTri === undefined || giaTri === null ? '' : giaTri).replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
  if (s.length > 40) s = s.substring(0, 40);
  return s;
}

// Chuẩn hóa số câu: 1-4, ngoài khoảng thì về 0 (không hợp lệ).
function chuanHoaVongHD3(giaTri) {
  var v = parseInt(giaTri, 10);
  if (isNaN(v) || v < 1 || v > 4) return 0;
  return v;
}

// CHUÔNG BẤM NHANH: chỉ ghi lượt bấm ĐẦU TIÊN của mỗi đội trong mỗi câu,
// và chỉ khi đúng câu đang mở VÀ chuông đang mở. Lượt bấm sau của cùng
// đội trong cùng câu, hoặc bấm khi chuông khóa / sai câu, đều bị bỏ qua
// (vẫn trả thanhCong để app điện thoại không báo lỗi, kèm daGhi=false).
function xuLyBuzzerHD3(goi) {
  var team = sachTenDoiHD3(goi.team);
  if (team === '') return { thanhCong: false, daGhi: false, loi: 'Thiếu tên đội.' };
  var vong = chuanHoaVongHD3(goi.round);
  if (vong === 0) return { thanhCong: false, daGhi: false, loi: 'Số câu phải là 1-4.' };
  var tt = docTrangThaiHD3();
  if (!tt.armed || tt.currentRound !== vong) {
    return { thanhCong: true, daGhi: false, loi: 'Chuông chưa mở cho Câu ' + vong + '.' };
  }
  var danhSach = docJsonHD3(TEN_FILE_BUZZER_HD3, []);
  if (!(danhSach instanceof Array)) danhSach = [];
  for (var i = 0; i < danhSach.length; i++) {
    if (danhSach[i] && danhSach[i].team === team && danhSach[i].round === vong) {
      return { thanhCong: true, daGhi: false, loi: 'Đội đã bấm chuông Câu ' + vong + ' rồi.' };
    }
  }
  danhSach.push({
    team: team,
    round: vong,
    serverTime: new Date().toISOString(),
    clientTime: goi.clientTime ? String(goi.clientTime) : ''
  });
  ghiJsonHD3(TEN_FILE_BUZZER_HD3, danhSach);
  return { thanhCong: true, daGhi: true, team: team, round: vong };
}

// ĐIỀU TRA: 1 đội chỉ có 1 bản — gửi lại thì GHI ĐÈ bản cũ của đúng đội đó.
function xuLyDieuTraHD3(goi) {
  var team = sachTenDoiHD3(goi.team);
  if (team === '') return { thanhCong: false, daGhi: false, loi: 'Thiếu tên đội.' };
  var nenNhap = String(goi.shouldEnter === undefined || goi.shouldEnter === null ? '' : goi.shouldEnter).toLowerCase();
  if (nenNhap !== 'khong' && nenNhap !== 'co') {
    return { thanhCong: false, daGhi: false, loi: 'shouldEnter phải là "khong" hoặc "co".' };
  }
  var dauHieu = [];
  if (goi.signs instanceof Array) {
    for (var i = 0; i < goi.signs.length; i++) {
      var s = parseInt(goi.signs[i], 10);
      if (!isNaN(s) && s >= 1 && s <= 4 && dauHieu.indexOf(s) === -1) dauHieu.push(s);
    }
  }
  var hanhDong = String(goi.action === undefined || goi.action === null ? '' : goi.action).replace(/^\s+|\s+$/g, '');
  if (hanhDong.length > 500) hanhDong = hanhDong.substring(0, 500);
  var banMoi = {
    team: team,
    shouldEnter: nenNhap,
    signs: dauHieu,
    action: hanhDong,
    time: new Date().toISOString()
  };
  var danhSach = docJsonHD3(TEN_FILE_DIEU_TRA_HD3, []);
  if (!(danhSach instanceof Array)) danhSach = [];
  var daThay = false;
  for (var j = 0; j < danhSach.length; j++) {
    if (danhSach[j] && danhSach[j].team === team) { danhSach[j] = banMoi; daThay = true; break; }
  }
  if (!daThay) danhSach.push(banMoi);
  ghiJsonHD3(TEN_FILE_DIEU_TRA_HD3, danhSach);
  return { thanhCong: true, daGhi: true, team: team, ghiDe: daThay };
}

// NHẬN XÉT: đội này nhận xét đội kia — cứ thêm vào danh sách.
function xuLyNhanXetHD3(goi) {
  var tuDoi = sachTenDoiHD3(goi.fromTeam);
  var toiDoi = sachTenDoiHD3(goi.toTeam);
  var noiDung = String(goi.text === undefined || goi.text === null ? '' : goi.text).replace(/^\s+|\s+$/g, '');
  if (tuDoi === '' || toiDoi === '') return { thanhCong: false, daGhi: false, loi: 'Thiếu tên đội nhận xét / đội được nhận xét.' };
  if (noiDung === '') return { thanhCong: false, daGhi: false, loi: 'Thiếu nội dung nhận xét.' };
  if (noiDung.length > 500) noiDung = noiDung.substring(0, 500);
  var danhSach = docJsonHD3(TEN_FILE_NHAN_XET_HD3, []);
  if (!(danhSach instanceof Array)) danhSach = [];
  danhSach.push({ fromTeam: tuDoi, toTeam: toiDoi, text: noiDung, time: new Date().toISOString() });
  ghiJsonHD3(TEN_FILE_NHAN_XET_HD3, danhSach);
  return { thanhCong: true, daGhi: true, fromTeam: tuDoi, toTeam: toiDoi };
}

// Điều phối HĐ3 theo loai — trả về JSON cho app điện thoại.
function xuLyHD3(goi) {
  try {
    var ketQua;
    if (goi.loai === 'buzzer') ketQua = xuLyBuzzerHD3(goi);
    else if (goi.loai === 'dieutra') ketQua = xuLyDieuTraHD3(goi);
    else if (goi.loai === 'nhanxet') ketQua = xuLyNhanXetHD3(goi);
    else ketQua = { thanhCong: false, daGhi: false, loi: 'loai không hợp lệ.' };
    return ContentService
      .createTextOutput(JSON.stringify(ketQua))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (loi) {
    return ContentService
      .createTextOutput(JSON.stringify({ thanhCong: false, daGhi: false, loi: String(loi) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Gói HĐ3 gửi dạng form (e.parameter): dựng lại object giống JSON.
function xuLyHD3TuThamSo(p) {
  var goi = { loai: p.loai, team: p.team || '', round: p.round || '', clientTime: p.clientTime || '' };
  goi.shouldEnter = p.shouldEnter || '';
  goi.action = p.action || '';
  goi.fromTeam = p.fromTeam || '';
  goi.toTeam = p.toTeam || '';
  goi.text = p.text || '';
  var dauHieu = [];
  if (p.signs) {
    try {
      var s = JSON.parse(p.signs);
      if (s instanceof Array) dauHieu = s;
    } catch (loiJson) {
      var phan = String(p.signs).split(',');
      for (var i = 0; i < phan.length; i++) {
        var n = parseInt(phan[i], 10);
        if (!isNaN(n)) dauHieu.push(n);
      }
    }
  }
  goi.signs = dauHieu;
  return goi;
}

// ---------- Trang host HĐ3 (vẽ sẵn phía máy chủ) ----------

// Giờ HH:MM:SS từ chuỗi ISO (giờ theo múi giờ của Apps Script).
function dinhDangGioHD3(iso) {
  try {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    function haiChuSo(n) { return (n < 10 ? '0' : '') + n; }
    return haiChuSo(d.getHours()) + ':' + haiChuSo(d.getMinutes()) + ':' + haiChuSo(d.getSeconds());
  } catch (loi) {
    return '';
  }
}

// Số giây từ lúc mở chuông (armedAt) đến lúc bấm (serverTime), 1 số lẻ.
function dinhDangGiayTuKhiMoHD3(mocIso, gioIso) {
  try {
    var moc = Date.parse(mocIso);
    var gio = Date.parse(gioIso);
    if (isNaN(moc) || isNaN(gio) || gio < moc) return '—';
    return ((gio - moc) / 1000).toFixed(1) + 's';
  } catch (loi) {
    return '—';
  }
}

// Mở đầu trang host HĐ3: cùng giao diện tối "HỘP ĐEN" + CSS riêng cho HĐ3.
function moDauTrangHD3(tieuDe, trangThai, urlLamMoi, tabDangChon) {
  var cssThem = '\n  /* HĐ3 host: hiện đại, chữ to, dễ nhìn trên TV. */\n' +
    '  .dau .nut-tai { font-size: 22px; padding: 16px 26px; }\n' +
    '  .dau .nut-quay-lai { font-size: 20px; padding: 16px 22px; }\n' +
    '  .nhan-dieu-khien { font-size: 15px; font-weight: 800; letter-spacing: 2px; color: #9ca3af; text-transform: uppercase; margin: 18px 0 10px; }\n' +
    '  .hang-nut-hd3 { display: flex; gap: 12px; flex-wrap: wrap; margin: 0 0 8px; }\n' +
    '  .nut-mo { background: linear-gradient(180deg, #22c55e, #16a34a); color: #fff; border: 0; border-radius: 14px; padding: 18px 26px; font-size: 22px; font-weight: 800; cursor: pointer; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px rgba(22,163,74,.35); }\n' +
    '  .nut-mo:hover { background: linear-gradient(180deg, #16a34a, #15803d); }\n' +
    '  .nut-khoa { background: linear-gradient(180deg, #f59e0b, #d97706); color: #fff; border: 0; border-radius: 14px; padding: 18px 26px; font-size: 22px; font-weight: 800; cursor: pointer; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px rgba(217,119,6,.35); }\n' +
    '  .nut-khoa:hover { background: linear-gradient(180deg, #d97706, #b45309); }\n' +
    '  .nut-xoa { background: transparent; color: #fca5a5; border: 2px solid #dc2626; border-radius: 14px; padding: 16px 22px; font-size: 19px; font-weight: 800; cursor: pointer; text-decoration: none; display: inline-block; }\n' +
    '  .nut-xoa:hover { background: #7f1d1d; color: #fff; }\n' +
    '  .hang-dat-lai { margin: 14px 0 4px; padding-top: 14px; border-top: 1px dashed #374151; }\n' +
    '  .hang-dat-lai .chu-thich { font-size: 15px; color: #9ca3af; margin-left: 10px; }\n' +
    '  .huy-hieu-trang-thai { display: inline-block; border-radius: 999px; padding: 12px 24px; font-size: 24px; font-weight: 900; letter-spacing: 1px; }\n' +
    '  .huy-hieu-trang-thai.mo { background: linear-gradient(180deg, #22c55e, #16a34a); color: #fff; box-shadow: 0 4px 16px rgba(22,163,74,.4); }\n' +
    '  .huy-hieu-trang-thai.khoa { background: #374151; color: #d1d5db; }\n' +
    '  .tien-trinh-cau { display: flex; gap: 10px; margin: 16px 0 4px; }\n' +
    '  .tien-trinh-cau span { flex: 1; text-align: center; font-size: 18px; font-weight: 800; padding: 12px 4px; border-radius: 12px; background: #17181c; border: 2px solid #2e2f36; color: #9ca3af; }\n' +
    '  .tien-trinh-cau span.hien-tai { background: #fbbf24; border-color: #fbbf24; color: #111; }\n' +
    '  .tien-trinh-cau span.xong { background: #14532d; border-color: #16a34a; color: #bbf7d0; }\n' +
    '  .tieu-de-phu { font-size: 18px; font-weight: 800; letter-spacing: 2px; color: #9ca3af; text-transform: uppercase; margin: 20px 0 12px; }\n' +
    '  .hang-xep-hang { display: flex; align-items: center; gap: 18px; background: #17181c; border: 1px solid #2e2f36; border-radius: 18px; padding: 20px 24px; margin-bottom: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.4); }\n' +
    '  .hang-xep-hang.nhat { background: linear-gradient(180deg, #422006, #17181c); border: 2px solid #f59e0b; box-shadow: 0 4px 20px rgba(245,158,11,.25); }\n' +
    '  .so-hang { flex: none; width: 64px; height: 64px; border-radius: 50%; background: #374151; color: #fff; font-size: 30px; font-weight: 900; display: flex; align-items: center; justify-content: center; }\n' +
    '  .hang-xep-hang.nhat .so-hang { background: linear-gradient(180deg, #fbbf24, #f59e0b); color: #111; }\n' +
    '  .ten-doi-xep-hang { flex: 1; font-size: 30px; font-weight: 800; color: #f3f4f6; word-break: break-word; }\n' +
    '  .hang-xep-hang.nhat .ten-doi-xep-hang { color: #fbbf24; }\n' +
    '  .nhan-nhanh-nhat { display: inline-block; background: #f59e0b; color: #111; font-size: 15px; font-weight: 900; letter-spacing: 1px; border-radius: 999px; padding: 4px 12px; margin-left: 10px; vertical-align: 4px; }\n' +
    '  .thoi-gian-xep-hang { flex: none; text-align: right; }\n' +
    '  .thoi-gian-xep-hang .giay { font-size: 40px; font-weight: 900; color: #fbbf24; line-height: 1; font-variant-numeric: tabular-nums; }\n' +
    '  .thoi-gian-xep-hang .gio { font-size: 15px; color: #9ca3af; margin-top: 4px; }\n' +
    '  .the-dieu-tra { background: #17181c; border: 1px solid #2e2f36; border-radius: 18px; padding: 22px 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.4); }\n' +
    '  .the-dieu-tra .ten-doi { font-size: 30px; font-weight: 800; color: #fbbf24; margin-bottom: 12px; word-break: break-word; }\n' +
    '  .phat-bieu-ket-luan { display: inline-block; border-radius: 999px; padding: 10px 20px; font-size: 20px; font-weight: 900; letter-spacing: 1px; }\n' +
    '  .phat-bieu-ket-luan.khong { background: #dc2626; color: #fff; }\n' +
    '  .phat-bieu-ket-luan.co { background: #16a34a; color: #fff; }\n' +
    '  .chip-dau-hieu { display: inline-block; background: #1e3a8a; color: #bfdbfe; border: 1px solid #3b82f6; border-radius: 999px; padding: 6px 14px; font-size: 17px; font-weight: 700; margin: 0 8px 8px 0; }\n' +
    '  .hop-hanh-dong { background: #111827; border: 1px solid #374151; border-radius: 12px; padding: 14px 16px; margin-top: 12px; font-size: 20px; line-height: 1.6; white-space: pre-wrap; }\n' +
    '  .nhan-xet-hd3 { background: #111827; border: 1px solid #374151; border-radius: 12px; padding: 12px 16px; margin-top: 10px; font-size: 19px; line-height: 1.55; }\n' +
    '  .nhan-xet-hd3 b { color: #fbbf24; }\n';
  var linkQuayLai = '<a class="nut-quay-lai" target="_top" href="' + escHtml(URL_WEB_APP) + '">← Quay lại menu</a>';
  return '<!DOCTYPE html>\n<html lang="vi">\n<head>\n<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + escHtml(tieuDe) + '</title>\n<style>\n' + CSS_TRINH_CHIEU + cssThem + '</style>\n</head>\n<body>\n' + thanhTab(tabDangChon || 'hopden') +
    '<div class="dau"><h1>' + escHtml(tieuDe) + '</h1><div class="trang-thai">' + escHtml(trangThai) + '</div>' +
    '<div style="margin-top:10px;">' + linkQuayLai + '<a class="nut-tai" target="_top" href="' + escHtml(urlLamMoi) + '">Làm mới trang</a></div></div>\n';
}

// Trang host CHUÔNG BẤM NHANH (?hd3=buzzer): mở/khóa câu + bảng xếp hạng.
function taoTrangBuzzerHD3() {
  var tt = docTrangThaiHD3();
  var tatCa = docJsonHD3(TEN_FILE_BUZZER_HD3, []);
  if (!(tatCa instanceof Array)) tatCa = [];
  var urlLamMoi = URL_WEB_APP + '?hd3=buzzer';
  var trangThai = tt.armed
    ? 'Câu ' + tt.currentRound + ' — ĐANG MỞ CHUÔNG, đội bấm được. Bấm "Làm mới trang" để xem lượt bấm mới.'
    : 'Chuông đang KHÓA. Bấm "Mở Câu N" để bắt đầu một câu.';
  // Thanh tiến trình 4 câu: câu đã có lượt bấm thì đánh dấu đã xong.
  var cauDaBam = {};
  for (var i0 = 0; i0 < tatCa.length; i0++) {
    if (tatCa[i0]) cauDaBam[tatCa[i0].round] = true;
  }
  var tienTrinh = '<div class="tien-trinh-cau">';
  for (var c0 = 1; c0 <= 4; c0++) {
    var lopCau = c0 === tt.currentRound ? ' class="hien-tai"' : (cauDaBam[c0] ? ' class="xong"' : '');
    tienTrinh += '<span' + lopCau + '>Câu ' + c0 + '</span>';
  }
  tienTrinh += '</div>';
  var nut = '<div class="nhan-dieu-khien">Điều khiển chuông</div><div class="hang-nut-hd3">';
  for (var c = 1; c <= 4; c++) {
    nut += '<a class="nut-mo" target="_top" href="' + escHtml(urlLamMoi + '&hanhdong=mo&vong=' + c) + '">🔔 Mở Câu ' + c + '</a>';
  }
  nut += '<a class="nut-khoa" target="_top" href="' + escHtml(urlLamMoi + '&hanhdong=khoa') + '">🔒 Khóa chuông</a></div>';
  nut += '<div class="hang-dat-lai"><a class="nut-xoa" target="_top" href="' + escHtml(urlLamMoi + '&hanhdong=datlai') + '">⚠️ Đặt lại — xóa hết lượt bấm</a><span class="chu-thich">Xóa toàn bộ lượt bấm của cả 4 câu. Chỉ dùng sau buổi học hoặc trước khi bắt đầu lại.</span></div>';
  var huyHieu = tt.armed
    ? '<span class="huy-hieu-trang-thai mo">🔔 ĐANG MỞ — CÂU ' + tt.currentRound + '</span>'
    : '<span class="huy-hieu-trang-thai khoa">🔒 ĐÃ KHÓA</span>';
  // Chỉ lượt bấm của câu hiện tại, xếp theo giờ bấm của máy chủ.
  var luot = [];
  for (var i = 0; i < tatCa.length; i++) {
    if (tatCa[i] && tatCa[i].round === tt.currentRound) luot.push(tatCa[i]);
  }
  luot.sort(function(a, b) { return Date.parse(a.serverTime) - Date.parse(b.serverTime); });
  var noiDung;
  if (luot.length === 0) {
    noiDung = '<div class="trong">Chưa có đội nào bấm chuông cho Câu ' + tt.currentRound + '.</div>';
  } else {
    var hang = '';
    for (var j = 0; j < luot.length; j++) {
      var muc = luot[j];
      hang += '<div class="hang-xep-hang' + (j === 0 ? ' nhat' : '') + '">' +
        '<div class="so-hang">' + (j + 1) + '</div>' +
        '<div class="ten-doi-xep-hang">' + escHtml(muc.team) + (j === 0 ? '<span class="nhan-nhanh-nhat">🏆 NHANH NHẤT</span>' : '') + '</div>' +
        '<div class="thoi-gian-xep-hang"><div class="giay">' + escHtml(dinhDangGiayTuKhiMoHD3(tt.armedAt, muc.serverTime)) + '</div>' +
        '<div class="gio">bấm lúc ' + escHtml(dinhDangGioHD3(muc.serverTime)) + '</div></div></div>';
    }
    noiDung = '<div class="tieu-de-phu">Bảng xếp hạng — Câu ' + tt.currentRound + '</div>' + hang;
  }
  return moDauTrangHD3('HĐ3 — CHUÔNG BẤM NHANH (Bài 4 lớp 8)', trangThai, urlLamMoi, 'buzzer') +
    '<div class="khung"><div style="margin: 8px 0 4px;">' + huyHieu + '</div>' + tienTrinh + nut + noiDung + '</div>' + dongTrangTrinhChieu();
}

// Trang host ĐIỀU TRA (?hd3=dieutra): tất cả bản điều tra + nhận xét gom theo đội.
function taoTrangDieuTraHD3() {
  var danhSach = docJsonHD3(TEN_FILE_DIEU_TRA_HD3, []);
  if (!(danhSach instanceof Array)) danhSach = [];
  var nhanXet = docJsonHD3(TEN_FILE_NHAN_XET_HD3, []);
  if (!(nhanXet instanceof Array)) nhanXet = [];
  danhSach.sort(function(a, b) { return Date.parse(a.time) - Date.parse(b.time); });
  var urlLamMoi = URL_WEB_APP + '?hd3=dieutra';
  var trangThai = danhSach.length === 0
    ? 'Chưa có đội nào nộp bản điều tra. Bấm "Làm mới trang" để xem bản mới nộp.'
    : 'Đã có ' + danhSach.length + ' đội nộp bản điều tra. Bấm "Làm mới trang" để xem bản mới nộp.';
  // Nhận xét gom theo đội được nhận xét.
  var nxTheoDoi = {};
  var doiDaCoDieuTra = {};
  for (var i = 0; i < danhSach.length; i++) { if (danhSach[i]) doiDaCoDieuTra[danhSach[i].team] = true; }
  for (var k = 0; k < nhanXet.length; k++) {
    var nx = nhanXet[k];
    if (!nx || !nx.toTeam) continue;
    if (!nxTheoDoi[nx.toTeam]) nxTheoDoi[nx.toTeam] = [];
    nxTheoDoi[nx.toTeam].push(nx);
  }
  function khoiNhanXet(doi) {
    var ds = nxTheoDoi[doi] || [];
    if (ds.length === 0) return '';
    var s = '<div style="margin-top:14px;"><div class="nhan">Nhận xét của các đội khác</div>';
    for (var q = 0; q < ds.length; q++) {
      s += '<div class="nhan-xet-hd3"><b>' + escHtml(ds[q].fromTeam) + ':</b> ' + escHtml(ds[q].text) +
        '<div class="gio-gui">' + escHtml(dinhDangGioHD3(ds[q].time)) + '</div></div>';
    }
    return s + '</div>';
  }
  var noiDung;
  if (danhSach.length === 0) {
    noiDung = '<div class="trong">Chưa có đội nào nộp bản điều tra.</div>';
  } else {
    var the = '';
    for (var j = 0; j < danhSach.length; j++) {
      var m = danhSach[j];
      var ketLuan = m.shouldEnter === 'co'
        ? '<span class="phat-bieu-ket-luan co">✓ NÊN NHẬP</span>'
        : '<span class="phat-bieu-ket-luan khong">✋ KHÔNG NÊN NHẬP</span>';
      var dauHieu;
      if (m.signs && m.signs.length > 0) {
        dauHieu = '';
        for (var s = 0; s < m.signs.length; s++) {
          dauHieu += '<span class="chip-dau-hieu">Dấu hiệu ' + m.signs[s] + '</span>';
        }
      } else {
        dauHieu = '<span style="color:#9ca3af;font-size:19px;">Chưa chọn dấu hiệu nào.</span>';
      }
      the += '<div class="the-dieu-tra"><div class="ten-doi">' + escHtml(m.team) + '</div>' + ketLuan +
        '<div class="hang-thong-tin"><div class="nhan">Dấu hiệu</div><div style="margin-top:10px;">' + dauHieu + '</div></div>' +
        '<div class="hang-thong-tin"><div class="nhan">Hành động sẽ làm</div><div class="hop-hanh-dong">' + escHtml(m.action || '(không ghi)') + '</div></div>' +
        '<div class="gio-gui">Nộp lúc ' + escHtml(dinhDangGioHD3(m.time)) + '</div>' +
        khoiNhanXet(m.team) + '</div>';
    }
    noiDung = '<div class="khung"><div class="tieu-de-phu">Kết quả các đội — ' + danhSach.length + ' đội đã nộp</div><div class="luoi-may">' + the + '</div></div>';
  }
  // Nhận xét gửi về đội chưa nộp điều tra (nếu có) — hiện riêng ở cuối.
  var doiLa = [];
  for (var doi in nxTheoDoi) { if (!doiDaCoDieuTra[doi]) doiLa.push(doi); }
  if (doiLa.length > 0) {
    var khoiLa = '';
    for (var l = 0; l < doiLa.length; l++) khoiLa += khoiNhanXet(doiLa[l]);
    noiDung += '<div class="khung"><div class="the-dieu-tra"><div class="ten-doi">Nhận xét về đội chưa nộp điều tra</div>' + khoiLa + '</div></div>';
  }
  return moDauTrangHD3('HĐ3 — ĐIỀU TRA (Bài 4 lớp 8)', trangThai, urlLamMoi, 'dieutra') + noiDung + dongTrangTrinhChieu();
}

function doPost(e) {
  try {
    // PHIÊN BẢN 24 — HĐ3 Luyện tập (Bài 4 lớp 8): payload có loai là
    // "buzzer" / "dieutra" / "nhanxet" thì xử lý riêng rồi trả về ngay.
    // Luồng "Biến hình" bên dưới KHÔNG đổi — chỉ chạy khi loai vắng mặt.
    if (e.postData && e.postData.contents) {
      try {
        var goiHD3 = JSON.parse(e.postData.contents);
        if (goiHD3 && typeof goiHD3 === 'object' &&
            (goiHD3.loai === 'buzzer' || goiHD3.loai === 'dieutra' || goiHD3.loai === 'nhanxet')) {
          return xuLyHD3(goiHD3);
        }
      } catch (loiHD3Json) {
        // Không phải JSON HĐ3 — rơi xuống luồng cũ bên dưới.
      }
    }
    if (e.parameter && (e.parameter.loai === 'buzzer' || e.parameter.loai === 'dieutra' || e.parameter.loai === 'nhanxet')) {
      return xuLyHD3(xuLyHD3TuThamSo(e.parameter));
    }
    var thongTin = { may: 1, ten: '', soDienThoai: '', viTri: '', danhBa: [], anh: [], amThanh: null, tomTat: '', tenMay: '', idMay: '', thoiGianDungApp: null };
    var daDocJson = false;
    if (e.postData && e.postData.contents) {
      try {
        var goi = JSON.parse(e.postData.contents);
        if (goi && typeof goi === 'object') {
          if (goi.duLieu && goi.ten && !goi.anh) {
            // Một ảnh duy nhất (định dạng cũ): ten là tên file ảnh.
            thongTin.may = goi.may;
            thongTin.anh = [goi];
          } else {
            thongTin.may = goi.may;
            thongTin.ten = goi.ten || '';
            thongTin.soDienThoai = goi.soDienThoai || '';
            thongTin.viTri = goi.viTri || '';
            thongTin.danhBa = goi.danhBa || [];
            thongTin.anh = goi.anh || [];
            thongTin.amThanh = goi.amThanh || null;
            thongTin.tomTat = goi.tomTat || '';
          }
          thongTin.tenMay = goi.tenMay || '';
          thongTin.idMay = goi.idMay || '';
          thongTin.thoiGianDungApp = goi.thoiGianDungApp || null;
          daDocJson = true;
        }
      } catch (loiJson) {
        // Không phải JSON, thử đọc dạng form bên dưới.
      }
    }
    if (!daDocJson && e.parameter) {
      var danhSach = [];
      var i = 0;
      while (e.parameter['ten' + i] !== undefined || e.parameter['anh' + i] !== undefined) {
        danhSach.push({
          ten: e.parameter['ten' + i] || ('anh-' + (i + 1) + '.jpg'),
          duLieu: e.parameter['anh' + i] || ''
        });
        i++;
      }
      if (danhSach.length === 0 && e.parameter.ten && e.parameter.duLieu) {
        danhSach = [{ ten: e.parameter.ten, duLieu: e.parameter.duLieu }];
      }
      thongTin.anh = danhSach;
      thongTin.may = e.parameter.may;
      thongTin.soDienThoai = e.parameter.soDienThoai || '';
      thongTin.viTri = e.parameter.viTri || '';
      thongTin.tomTat = e.parameter.tomTat || '';
      thongTin.tenMay = e.parameter.tenMay || '';
      thongTin.idMay = e.parameter.idMay || '';
      try {
        thongTin.thoiGianDungApp = e.parameter.thoiGianDungApp ? JSON.parse(e.parameter.thoiGianDungApp) : null;
      } catch (loiTG) {
        thongTin.thoiGianDungApp = null;
      }
      try {
        thongTin.amThanh = e.parameter.amThanh ? JSON.parse(e.parameter.amThanh) : null;
      } catch (loiAmThanh) {
        thongTin.amThanh = null;
      }
      try {
        thongTin.danhBa = e.parameter.danhBa ? JSON.parse(e.parameter.danhBa) : [];
      } catch (loiDanhBa) {
        thongTin.danhBa = [];
      }
    }
    // App "Biến Hình AI" v1.1 gửi theo TÊN MÁY (có idMay): lưu theo tên,
    // không động vào các ô Máy. Ngược lại (app/web cũ, chỉ có "may"):
    // giữ nguyên logic ô Máy như trước.
    var safeIdGui = sachIdMay(thongTin.idMay);
    if (safeIdGui !== '') {
      var ketQuaTen = luuThongTinTheoTen(thongTin);
      // Phiên bản 21: cập nhật file chỉ mục + xóa cache menu (best-effort,
      // không làm hỏng lần gửi nếu chỉ mục lỗi).
      try { capNhatChiMucSauKhiGui(ketQuaTen.idMay); } catch (loiChiMuc) {}
      return ContentService
        .createTextOutput(JSON.stringify({ thanhCong: true, tenMay: ketQuaTen.tenMay, idMay: ketQuaTen.idMay, soAnh: ketQuaTen.soAnh }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var ketQua = luuThongTinVaoDrive(thongTin);
    // Phiên bản 21: cập nhật file chỉ mục + xóa cache menu (best-effort).
    try { capNhatChiMucSauKhiGui('may-' + ketQua.soMay); } catch (loiChiMuc2) {}
    return ContentService
      .createTextOutput(JSON.stringify({ thanhCong: true, may: 'Máy ' + ketQua.soMay, soAnh: ketQua.soAnh }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (loi) {
    return ContentService
      .createTextOutput(JSON.stringify({ thanhCong: false, loi: String(loi) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ---------- Trang web ----------
// ?page=gui  -> trang gửi thông tin (mở trên điện thoại của thầy)
// (không tham số) -> trang trình chiếu (mở trên laptop của thầy)
// ============================================================================
//  TRANG TRÌNH CHIẾU — VẼ SẴN PHÍA MÁY CHỦ (không dùng google.script.run)
//  Lý do: từ 11:58 ngày 21/11, đoạn <script> trên trang trình chiếu không gọi
//  được lên máy chủ (nhật ký Thực thi: 0 lần layKhoaThongTin dù trang mở nhiều
//  lần; Phiên bản 9 vẫn chỉ kẹt ở "Đang tải thông tin...") nên trang không bao
//  giờ hiện dữ liệu. Bản này doGet vẽ sẵn toàn bộ thẻ máy + ảnh + link tải về
//  ngay trên máy chủ rồi trả về HTML hoàn chỉnh — mở link là thấy ngay, không
//  cần JavaScript. KHÔNG tự tải lại: meta refresh làm trang trắng sau 3 giây
//  trong iframe Apps Script (kiểm 21/11 14:10), nên bỏ hẳn — thầy bấm F5 hoặc
//  nút "Làm mới trang" để xem máy mới gửi.
//  Nút "Tải Album về": mỗi ảnh có 1 nút tải riêng (link thuần HTML, bấm là tải
//  thẳng file ảnh đó về máy); bấm vào chính tấm ảnh cũng tải ảnh đó về.
// ============================================================================

// Thoát ký tự HTML để tên/số/vị trí thầy nhập không phá vỡ trang.
function escHtml(s) {
  s = String(s === undefined || s === null ? '' : s);
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Link Google Maps phía máy chủ (cùng luật với bản cũ: số đầu > 90 thì đảo lại).
function linkMapsMayChu(viTri) {
  var phan = String(viTri).split(',');
  if (phan.length === 2) {
    var so1 = Number(phan[0].trim());
    var so2 = Number(phan[1].trim());
    if (phan[0].trim() !== '' && phan[1].trim() !== '' && !isNaN(so1) && !isNaN(so2)) {
      var lat = so1, lng = so2;
      if (Math.abs(lat) > 90 && Math.abs(lng) <= 90) { lat = so2; lng = so1; }
      return 'https://www.google.com/maps?q=' + lat + ',' + lng;
    }
  }
  return 'https://www.google.com/maps?q=' + encodeURIComponent(viTri);
}

// Nội dung file .txt danh bạ của 1 máy (để tải về bằng link data: thuần HTML).
function chuoiDanhBaTxt(m) {
  var dong = [];
  dong.push('Danh bạ — ' + m.may);
  if (m.ten) dong.push('Tên: ' + m.ten);
  if (m.soDienThoai) dong.push('Số điện thoại: ' + m.soDienThoai);
  dong.push('');
  for (var i = 0; i < m.danhBa.length; i++) {
    dong.push(m.danhBa[i].ten + (m.danhBa[i].so ? ' — ' + m.danhBa[i].so : ''));
  }
  return dong.join('\n');
}

function hangMayChu(nhan, chu) {
  return '<div class="hang-thong-tin"><div class="nhan">' + escHtml(nhan) + '</div>' +
    '<div class="gia-tri">' + escHtml(chu && chu !== '' ? chu : 'Chưa nhập') + '</div></div>';
}

// Định dạng mili-giây thành "X giờ Y phút" (dưới 1 giờ thì "X phút", 0 thì "0 phút").
function dinhDangThoiGianMs(ms) {
  ms = Math.floor(Number(ms) || 0);
  if (ms < 0) ms = 0;
  var phut = Math.floor(ms / 60000);
  if (phut < 60) return phut + ' phút';
  var gio = Math.floor(phut / 60);
  var phutLe = phut % 60;
  return gio + ' giờ ' + phutLe + ' phút';
}

// Bảng "THỜI GIAN DÙNG APP" cho thẻ máy theo tên (dữ liệu có cấu trúc
// thoiGianDungApp). Mỗi app 1 dòng: thời gian + số lần mở; dòng cuối là tổng.
function bangThoiGianDungApp(tg) {
  if (!tg) return '';
  var tenApp = ['TikTok', 'Facebook', 'Zalo', 'YouTube'];
  var h = '<div class="hang-thong-tin"><div class="nhan">Thời gian dùng app' + (tg.ngay ? ' — ngày ' + escHtml(tg.ngay) : '') + '</div><table class="bang-app">';
  for (var i = 0; i < tenApp.length; i++) {
    var a = (tg.apps && tg.apps[tenApp[i]]) || { ms: 0, lanMo: 0 };
    h += '<tr><td>' + tenApp[i] + '</td><td>' + dinhDangThoiGianMs(a.ms) + '</td><td>mở ' + (a.lanMo || 0) + ' lần</td></tr>';
  }
  h += '<tr class="tong"><td>Tổng cộng</td><td>' + dinhDangThoiGianMs(tg.tongMs) + '</td><td></td></tr>';
  h += '</table></div>';
  return h;
}

// ---------- DỮ LIỆU GIẢ LẬP — THỜI GIAN DÙNG APP + KẾT LUẬN SỞ THÍCH (PHIÊN BẢN 23) ----------
// Thầy dạy bài 4 lớp 8 (8.A2.1): muốn trang trình chiếu "bịa" ra thời gian
// dùng TikTok / YouTube / Facebook / Zalo (giả lập, tính theo tuần) và 1 đoạn
// kết luận sở thích cho MỖI MÁY — mỗi máy 1 con số khác nhau, 1 sở thích
// khác nhau — để minh họa cách AI dùng dữ liệu hành vi để định hướng lựa chọn.
//   * KHÔNG phải dữ liệu thật: không đọc từ điện thoại, không lưu lên Drive,
//     không gửi từ app. Số liệu được TÍNH NGAY TRÊN MÁY CHỦ từ khóa máy
//     (băm chuỗi "may-N" / idMay) nên CÙNG 1 máy LUÔN hiện CÙNG 1 con số
//     (mở lại trang vẫn vậy), máy khác thì số khác.
//   * CHỈ hiện khi máy KHÔNG có thoiGianDungApp THẬT (APK, bản 14). Máy nào
//     đã có dữ liệu thật thì hiện bảng thật như bản 14, không thêm giả lập.
//   * NHÃN RÕ RÀNG: tiêu đề "GIẢ LẬP" + dòng "(Dữ liệu mô phỏng để minh họa
//     — không phải dữ liệu thật)" — đây là bài dạy về AI thao túng nên tuyệt
//     đối không được để học sinh tưởng số liệu giả là thật.
//   * Không động vào doPost / app điện thoại / file JSON trên Drive.
// Gắn vào mục máy bằng ganGiaLapChoMay(m) — gọi trong layThongTinTatCaMay
// và layThongTinMotMay (cả 2 đều gọi trước khi trả mục máy). Thẻ máy vẽ
// bảng + kết luận bằng bangGiaLapDungApp(g) trong theMayMayChu.

// Băm 1 chuỗi thành số nguyên không âm (djb2 + trộn cuối kiểu MurmurHash3
// fmix32) — dùng để rút số giả lập theo khóa máy. Cùng khóa -> cùng số;
// khóa khác -> số khác. Bước trộn cuối là BẮT BUỘC: không có nó, "may-1"
// với "may-2" chỉ khác nhau 1 đơn vị ở mã băm, làm tròn 15 phút sẽ gộp
// chúng về cùng 1 con số (đã bắt lỗi này khi kiểm thử — 3 máy đầu trùng
// nhau). Math.imul có sẵn trên Apps Script (runtime V8).
function bamMaChuoi(chu) {
  var h = 5381;
  chu = String(chu || '');
  for (var i = 0; i < chu.length; i++) {
    h = ((h << 5) + h + chu.charCodeAt(i)) >>> 0;
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

// 8 hồ sơ sở thích giả lập — mỗi hồ sơ: tên sở thích + câu kết luận của AI
// (AI đoán người này thích gì, rồi sẽ đề xuất / quảng cáo gì tiếp theo).
var HO_SO_GIA_LAP = [
  {
    ten: 'xem ca nhạc',
    ketLuan: 'Người này thích xem ca nhạc và video biểu diễn. AI sẽ đoán bạn ấy mê âm nhạc, rồi đề xuất thêm video ca nhạc mới, quảng cáo nhạc cụ, vé xem ca nhạc và các buổi hòa nhạc gần đây.'
  },
  {
    ten: 'xem phim AI giả tưởng',
    ketLuan: 'Người này thích xem phim viễn tưởng về AI và robot. AI sẽ đoán bạn ấy mê thế giới tương lai, rồi đề xuất thêm phim khoa học viễn tưởng mới, quảng cáo đồ chơi robot và các video "AI sẽ thay thế con người không?".'
  },
  {
    ten: 'nghe nhạc TikTok',
    ketLuan: 'Người này thích nghe nhạc trên TikTok và xem video nhảy theo nhạc. AI sẽ đoán bạn ấy mê nhạc thịnh hành, rồi đề xuất thêm các bài nhạc đang hot, quảng cáo tai nghe và thử thách nhảy mới.'
  },
  {
    ten: 'xem video game',
    ketLuan: 'Người này thích xem video chơi game và review game mới. AI sẽ đoán bạn ấy mê game, rồi đề xuất thêm video game hot, quảng cáo thiết bị chơi game và các giải đấu sắp diễn ra.'
  },
  {
    ten: 'xem video nấu ăn',
    ketLuan: 'Người này thích xem video nấu ăn và ẩm thực. AI sẽ đoán bạn ấy thích nấu nướng, rồi đề xuất thêm công thức mới, quảng cáo dụng cụ bếp và các quán ăn đang được nhiều người nhắc đến.'
  },
  {
    ten: 'xem tin tức và thời sự',
    ketLuan: 'Người này thích xem tin tức và thời sự. AI sẽ đoán bạn ấy quan tâm chuyện đang xảy ra, rồi đề xuất thêm các bản tin mới nhất, quảng cáo báo chí và các video bình luận thời sự.'
  },
  {
    ten: 'xem video hài',
    ketLuan: 'Người này thích xem video hài và tiểu phẩm vui. AI sẽ đoán bạn ấy thích cười, rồi đề xuất thêm các video hài mới, quảng cáo vé xem hài kịch và các chương trình giải trí đang hot.'
  },
  {
    ten: 'xem video học tập',
    ketLuan: 'Người này thích xem video học tập và kỹ năng mới. AI sẽ đoán bạn ấy thích học hỏi, rồi đề xuất thêm các khóa học trực tuyến, quảng cáo sách hay và các video hướng dẫn kỹ năng.'
  }
];

// Tính dữ liệu giả lập cho 1 máy từ khóa máy (deterministic — cùng khóa
// luôn ra cùng số). Trả về {tiktok, youtube, facebook, zalo (phút/tuần),
// tong (phút/tuần), hoSo: 1 trong 8 hồ sơ trên}.
// Phạm vi (giờ/tuần): TikTok 4–28, YouTube 3–20, Facebook 2–15, Zalo 1–8.
// Số phút làm tròn theo 15 phút cho tự nhiên (ví dụ "7 giờ 30 phút").
function duLieuGiaLapMay(khoa) {
  var h = bamMaChuoi(khoa);
  function rutPhut(min, max, dich) {
    // Lấy 1 số trong [min, max] (phút), làm tròn xuống bội số 15.
    var khoang = max - min + 1;
    var so = min + ((h >>> dich) % khoang);
    return Math.floor(so / 15) * 15;
  }
  var tiktok = rutPhut(4 * 60, 28 * 60, 0);
  var youtube = rutPhut(3 * 60, 20 * 60, 5);
  var facebook = rutPhut(2 * 60, 15 * 60, 11);
  var zalo = rutPhut(1 * 60, 8 * 60, 17);
  var hoSo = HO_SO_GIA_LAP[(h >>> 23) % HO_SO_GIA_LAP.length];
  return {
    tiktok: tiktok,
    youtube: youtube,
    facebook: facebook,
    zalo: zalo,
    tong: tiktok + youtube + facebook + zalo,
    hoSo: hoSo
  };
}

// Định dạng số phút thành "X giờ Y phút" (dưới 1 giờ thì "X phút",
// đúng giờ chẵn thì "X giờ").
function dinhDangPhut(phut) {
  phut = Math.floor(Number(phut) || 0);
  if (phut < 0) phut = 0;
  if (phut < 60) return phut + ' phút';
  var gio = Math.floor(phut / 60);
  var phutLe = phut % 60;
  if (phutLe === 0) return gio + ' giờ';
  return gio + ' giờ ' + phutLe + ' phút';
}

// Gắn dữ liệu GIẢ LẬP vào 1 mục máy (đã xây xong) — chỉ khi máy KHÔNG có
// thoiGianDungApp THẬT (APK, bản 14) và máy ĐÃ CÓ dữ liệu thật khác (tên /
// số / vị trí / danh bạ / ảnh / tóm tắt / giọng nói). Trả về chính mục đó
// (đã thêm m.giaLap, hoặc m.giaLap = null nếu không gắn).
// Khóa băm lấy bằng khoaXemMay(m): ô Máy -> "may-N", máy theo tên -> idMay.
function ganGiaLapChoMay(m) {
  if (!m) return m;
  if (m.thoiGianDungApp) { m.giaLap = null; return m; }
  var co = (m.ten && m.ten !== '') || (m.soDienThoai && m.soDienThoai !== '') ||
    (m.viTri && m.viTri !== '') || (m.danhBa && m.danhBa.length > 0) ||
    (m.anh && m.anh.length > 0) || (m.tomTat && m.tomTat !== '') ||
    (m.amThanh && m.amThanh !== '');
  if (!co) { m.giaLap = null; return m; }
  m.giaLap = duLieuGiaLapMay(khoaXemMay(m));
  return m;
}

// Vẽ bảng "THỜI GIAN DÙNG APP — GIẢ LẬP" + đoạn "KẾT LUẬN CỦA AI — GIẢ LẬP"
// cho 1 máy (dữ liệu đã tính bằng duLieuGiaLapMay).
// Cùng kiểu bảng .bang-app với bảng thật (bản 14) để nhìn quen mắt.
// Đoạn kết luận: (a) app nào dùng nhiều nhất + bao nhiêu giờ/tuần,
// (b) sở thích của người này theo hồ sơ, (c) AI sẽ đề xuất / quảng cáo gì
// tiếp theo vì sở thích đó; cuối đoạn chốt 1 câu nối với bài học (8.A2.1).
function bangGiaLapDungApp(g) {
  if (!g) return '';
  var h = '<div class="hang-thong-tin"><div class="nhan">Thời gian dùng app — GIẢ LẬP (mỗi tuần)</div>' +
    '<div class="ghi-chu-gia-lap">(Dữ liệu mô phỏng để minh họa — không phải dữ liệu thật)</div>' +
    '<table class="bang-app">';
  h += '<tr><td>TikTok</td><td>' + dinhDangPhut(g.tiktok) + '/tuần</td></tr>';
  h += '<tr><td>YouTube</td><td>' + dinhDangPhut(g.youtube) + '/tuần</td></tr>';
  h += '<tr><td>Facebook</td><td>' + dinhDangPhut(g.facebook) + '/tuần</td></tr>';
  h += '<tr><td>Zalo</td><td>' + dinhDangPhut(g.zalo) + '/tuần</td></tr>';
  h += '<tr class="tong"><td>Tổng cộng</td><td>' + dinhDangPhut(g.tong) + '/tuần</td></tr>';
  h += '</table></div>';
  var appNhieuNhat = 'TikTok';
  var gioNhieuNhat = g.tiktok;
  if (g.youtube > gioNhieuNhat) { appNhieuNhat = 'YouTube'; gioNhieuNhat = g.youtube; }
  if (g.facebook > gioNhieuNhat) { appNhieuNhat = 'Facebook'; gioNhieuNhat = g.facebook; }
  if (g.zalo > gioNhieuNhat) { appNhieuNhat = 'Zalo'; gioNhieuNhat = g.zalo; }
  h += '<div class="hang-thong-tin"><div class="nhan">Kết luận của AI — GIẢ LẬP</div>' +
    '<div class="tom-tat">Máy này dùng ' + appNhieuNhat + ' nhiều nhất (' + dinhDangPhut(gioNhieuNhat) + ' mỗi tuần, trong tổng số ' + dinhDangPhut(g.tong) + ' dùng app mỗi tuần). ' +
    escHtml(g.hoSo.ketLuan) +
    '<br><br>Đây chính là cách AI dùng dữ liệu hành vi để định hướng lựa chọn — YCCĐ 8.A2.1.</div></div>';
  return h;
}

// "Gửi lúc HH:MM ngày DD/MM/YYYY" từ chuỗi ISO (giờ Việt Nam).
function dinhDangThoiGianGui(iso) {
  try {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'HH:mm') + ' ngày ' + Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy');
  } catch (loi) {
    return iso;
  }
}

function theMayMayChu(m, dangDung) {
  var laTheoTen = m.loai === 'ten';
  var tieuDe = laTheoTen ? (m.tenMay || m.may || 'Máy theo tên') : m.may;
  // Khóa duy nhất cho hộp xem ảnh lớn: máy theo tên dùng idMay đã làm sạch,
  // ô Máy dùng số máy. Hai máy trùng tên cũng không bao giờ trùng khóa.
  var khoaThe = laTheoTen ? String(m.idMay || '').replace(/[^A-Za-z0-9_-]/g, '') : String(m.may).replace(/\D/g, '');
  if (khoaThe === '') khoaThe = '1';
  var coDuLieu = (m.ten && m.ten !== '') || (m.soDienThoai && m.soDienThoai !== '') ||
    (m.viTri && m.viTri !== '') || (m.danhBa && m.danhBa.length > 0) || (m.anh && m.anh.length > 0) || (m.tomTat && m.tomTat !== '') || !!m.thoiGianDungApp || (m.amThanh && m.amThanh !== '');
  var h = '<div class="the-may' + (coDuLieu ? '' : ' trong') + '">';
  h += '<div class="nhan-may">' + escHtml(tieuDe) + '</div>';
  if (dangDung) {
    h += '<div><span class="huy-hieu-dang-dung">ĐANG DÙNG</span></div>';
  }
  if (m.thoiGianGui && m.thoiGianGui !== '') {
    h += '<div class="gio-gui">Gửi lúc ' + escHtml(dinhDangThoiGianGui(m.thoiGianGui)) + '</div>';
  }
  if (!coDuLieu) {
    h += '<div class="gia-tri nho" style="color:#9ca3af">' + escHtml(tieuDe) + ' — chưa có thông tin</div>';
    h += '</div>';
    return h;
  }
  h += hangMayChu('Họ và tên', m.ten || '');
  h += hangMayChu('Số điện thoại', m.soDienThoai || '');
  h += '<div class="hang-thong-tin"><div class="nhan">Vị trí lúc này (bấm để mở Google Maps)</div><div class="gia-tri nho">';
  if (m.viTri && m.viTri !== '') {
    h += '<a class="link-map" target="_blank" rel="noopener" href="' + escHtml(linkMapsMayChu(m.viTri)) + '">' + escHtml(m.viTri) + '</a>';
  } else {
    h += 'Chưa nhập';
  }
  h += '</div></div>';
  h += '<div class="hang-thong-tin"><div class="nhan">Danh bạ app đã lấy</div><ul class="ds-danh-ba">';
  if (!m.danhBa || m.danhBa.length === 0) {
    h += '<li style="color:#9ca3af">Chưa chọn người nào</li>';
  } else {
    for (var i = 0; i < m.danhBa.length; i++) {
      h += '<li>' + escHtml(m.danhBa[i].ten + (m.danhBa[i].so ? ' — ' + m.danhBa[i].so : '')) + '</li>';
    }
  }
  h += '</ul></div>';
  if (laTheoTen && m.thoiGianDungApp) {
    h += bangThoiGianDungApp(m.thoiGianDungApp);
  }
  // Dữ liệu GIẢ LẬP (Phiên bản 23): chỉ hiện khi máy KHÔNG có
  // thoiGianDungApp THẬT (m.giaLap đã gắn trong layThongTinTatCaMay /
  // layThongTinMotMay). Máy nào có dữ liệu thật thì hiện bảng thật ở trên.
  if (m.giaLap) {
    h += bangGiaLapDungApp(m.giaLap);
  }
  if (m.tomTat && m.tomTat !== '') {
    h += '<div class="hang-thong-tin"><div class="nhan">Bản tóm tắt hành vi (AI quét được trên máy thầy)</div><div class="tom-tat">' + escHtml(m.tomTat) + '</div></div>';
  }
  // Giọng nói đã thu (Phiên bản 16): trình phát thuần HTML, không dùng
  // JavaScript; preload="none" để trang không tải âm thanh khi chưa bấm nghe.
  if (m.amThanh && m.amThanh !== '') {
    h += '<div class="hang-thong-tin"><div class="nhan">Giọng nói đã thu</div>' +
      '<audio controls preload="none" src="' + m.amThanh + '"></audio>' +
      '<div class="chu-thich-am-thanh">Bấm ▶ để nghe lại giọng nói thầy vừa thu trên điện thoại.</div></div>';
  }
  if (m.anh && m.anh.length > 0) {
    h += '<div class="luoi-anh">';
    for (var j = 0; j < m.anh.length; j++) {
      h += '<a href="#xem-' + khoaThe + '-anh' + (j + 1) + '" title="Bấm để xem ảnh lớn"><img src="' + m.anh[j].anh + '" alt="' + escHtml(m.anh[j].ten || '') + '"></a>';
    }
    h += '</div>';
    h += '<div class="chu-thich-anh">Ảnh app vừa lấy (' + m.anh.length + ' ảnh). Bấm vào từng ảnh để xem lớn; nút "Tải ảnh N về" để tải về máy.</div>';
    for (var j2 = 0; j2 < m.anh.length; j2++) {
      var tenAnh = escHtml(m.anh[j2].ten || ('anh-' + (j2 + 1) + '.jpg'));
      h += '<div class="xem-anh" id="xem-' + khoaThe + '-anh' + (j2 + 1) + '"><a class="dong-xem" href="#">✕ Đóng</a><img src="' + m.anh[j2].anh + '" alt="' + tenAnh + '"><div class="ten-anh">' + tenAnh + '</div><a class="nut-tai" href="' + m.anh[j2].anh + '" download="' + tenAnh + '">Tải ảnh này về</a></div>';
    }
  }
  var nut = '';
  if (m.anh && m.anh.length > 0) {
    for (var k = 0; k < m.anh.length; k++) {
      nut += '<a class="nut-tai" href="' + m.anh[k].anh + '" download="' + escHtml(m.anh[k].ten || ('anh-' + (k + 1) + '.jpg')) + '">Tải ảnh ' + (k + 1) + ' về</a>';
    }
  }
  if (m.danhBa && m.danhBa.length > 0) {
    var b64 = Utilities.base64Encode(Utilities.newBlob(chuoiDanhBaTxt(m), 'text/plain', 'danh-ba.txt').getBytes());
    nut += '<a class="nut-tai" href="data:text/plain;charset=utf-8;base64,' + b64 + '" download="danh-ba-' + khoaThe + '.txt">Tải Danh bạ về</a>';
  }
  if (m.amThanh && m.amThanh !== '') {
    var tenAmThanh = escHtml(m.tenFileAmThanh || ('giong-noi-' + khoaThe + '.' + duoiAmThanh(m.dinhDangAmThanh)));
    nut += '<a class="nut-tai" href="' + m.amThanh + '" download="' + tenAmThanh + '">Tải giọng nói về</a>';
  }
  if (nut !== '') h += '<div class="hang-tai">' + nut + '</div>';
  // Nút xóa dữ liệu của đúng máy này (Phiên bản 15): dẫn sang trang xác nhận,
  // chưa xóa gì ở bước này. Chỉ hiện trên thẻ đã có dữ liệu.
  var idXoa = laTheoTen ? String(m.idMay || '') : String(m.may).replace(/\D/g, '');
  if (idXoa !== '') {
    h += '<div class="hang-tai"><a class="nut-xoa" target="_top" href="' + escHtml(URL_WEB_APP) + '?action=xoa&id=' + escHtml(encodeURIComponent(idXoa)) + '">🗑 Xóa dữ liệu máy này</a></div>';
  }
  h += '</div>';
  return h;
}

// ---------- Trang XÁC NHẬN + KẾT QUẢ xóa (Phiên bản 15) ----------
// Hai bước, vẽ sẵn phía máy chủ, không dùng JavaScript:
//   Bước 1: ?action=xoa&id=<id>            -> trang xác nhận (CHƯA xóa gì)
//   Bước 2: ?action=xoa&id=<id>&xacNhan=1  -> xóa thật rồi hiện kết quả
// Không có nút "xóa tất cả": xóa từng máy một.
function taoTrangXacNhanXoa(idNhan, nhan) {
  var linkXoa = URL_WEB_APP + '?action=xoa&id=' + encodeURIComponent(idNhan) + '&xacNhan=1';
  return '<!DOCTYPE html>\n<html lang="vi">\n<head>\n<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>Xác nhận xóa dữ liệu</title>\n<style>\n' +
    '  * { box-sizing: border-box; }\n' +
    '  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #111; color: #f3f4f6; }\n' +
    '  .hop { max-width: 560px; margin: 0 auto; padding: 40px 20px; }\n' +
    '  h1 { font-size: 28px; margin: 0 0 12px; }\n' +
    '  p { font-size: 19px; line-height: 1.6; }\n' +
    '  .nut { display: inline-block; border-radius: 10px; padding: 14px 22px; font-size: 18px; font-weight: 700; text-decoration: none; margin: 8px 8px 0 0; }\n' +
    '  .nut-xoa { background: #dc2626; color: #fff; }\n' +
    '  .nut-huy { background: #374151; color: #fff; }\n' +
    '</style>\n</head>\n<body>\n<div class="hop">\n' +
    '<h1>Xóa dữ liệu máy này?</h1>\n' +
    '<p>Bạn có chắc chắn muốn xóa toàn bộ dữ liệu của <b>' + escHtml(nhan) + '</b>? (tên, số điện thoại, vị trí, danh bạ, ảnh, bản tóm tắt, giọng nói). Sau khi xóa sẽ <b>không lấy lại được</b>.</p>\n' +
    '<a class="nut nut-xoa" target="_top" href="' + escHtml(linkXoa) + '">🗑 Xóa ngay</a>' +
    '<a class="nut nut-huy" target="_top" href="' + escHtml(URL_WEB_APP) + '">Hủy — quay lại menu</a>\n' +
    '</div>\n</body>\n</html>';
}

function taoTrangKetQuaXoa(timThay, nhan) {
  var tieuDe = timThay ? 'Đã xóa xong' : 'Không tìm thấy dữ liệu';
  var dong = timThay
    ? 'Đã xóa dữ liệu của <b>' + escHtml(nhan) + '</b> khỏi Google Drive của thầy.'
    : 'Không tìm thấy dữ liệu của máy này trong Google Drive của thầy.';
  return '<!DOCTYPE html>\n<html lang="vi">\n<head>\n<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + tieuDe + '</title>\n<style>\n' +
    '  * { box-sizing: border-box; }\n' +
    '  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #111; color: #f3f4f6; }\n' +
    '  .hop { max-width: 560px; margin: 0 auto; padding: 40px 20px; }\n' +
    '  h1 { font-size: 28px; margin: 0 0 12px; }\n' +
    '  p { font-size: 19px; line-height: 1.6; }\n' +
    '  .nut { display: inline-block; border-radius: 10px; padding: 14px 22px; font-size: 18px; font-weight: 700; text-decoration: none; margin: 8px 8px 0 0; background: #374151; color: #fff; }\n' +
    '</style>\n</head>\n<body>\n<div class="hop">\n' +
    '<h1>' + tieuDe + '</h1>\n' +
    '<p>' + dong + '</p>\n' +
    '<a class="nut" target="_top" href="' + escHtml(URL_WEB_APP) + '">Quay lại menu</a>\n' +
    '</div>\n</body>\n</html>';
}

// ============================================================================
//  TRANG TRÌNH CHIẾU — VẼ SẴN PHÍA MÁY CHỦ (không dùng google.script.run)
//  Lý do: từ 11:58 ngày 21/11, đoạn <script> trên trang trình chiếu không gọi
//  được lên máy chủ (nhật ký Thực thi: 0 lần layKhoaThongTin dù trang mở nhiều
//  lần; Phiên bản 9 vẫn chỉ kẹt ở "Đang tải thông tin...") nên trang không bao
//  giờ hiện dữ liệu. Bản này doGet vẽ sẵn toàn bộ thẻ máy + ảnh + link tải về
//  ngay trên máy chủ rồi trả về HTML hoàn chỉnh — mở link là thấy ngay, không
//  cần JavaScript. KHÔNG tự tải lại: meta refresh làm trang trắng sau 3 giây
//  trong iframe Apps Script (kiểm 21/11 14:10), nên bỏ hẳn — thầy bấm F5 hoặc
//  nút "Làm mới trang" để xem máy mới gửi.
//  Nút "Tải Album về": mỗi ảnh có 1 nút tải riêng (link thuần HTML, bấm là tải
//  thẳng file ảnh đó về máy); bấm vào chính tấm ảnh cũng tải ảnh đó về.
//  PHIÊN BẢN 22 (21/11/2026): MENU danh sách máy là trang mặc định — xếp theo thời gian, mới nhất lên trên, CHỈ hiện ĐÚNG 6 máy gửi gần nhất. Link điều hướng có target="_top" (thoát khung nhúng). Menu + chi tiết dùng chỉ mục nhanh (cache 60 giây / 1 file danh-sach-may.json), không tải ảnh/âm thanh của mọi máy.
// ============================================================================

// ---------- Trang MENU / CHI TIẾT / XEM TẤT CẢ (Phiên bản 22) ----------
// Menu là trang mặc định: ĐÚNG 6 máy gửi GẦN NHẤT (mới nhất lên trên),
// mỗi dòng hiện TÊN MÁY to + GIỜ GỬI ("Gửi lúc HH:MM ngày DD/MM/YYYY")
// + huy hiệu "ĐANG DÙNG" cho máy gửi gần nhất. Bấm 1 dòng -> trang chi
// tiết chỉ 1 máy đó (?xem=<khóa>). "Xem tất cả" (?xem=tat-ca) -> lưới
// tất cả các thẻ như trước (không giới hạn 6 máy). Trang chi tiết / xem
// tất cả có link "← Quay lại menu". Xóa xong cũng quay lại menu. Tất cả
// vẽ sẵn phía máy chủ, không JavaScript, không google.script.run, không
// meta refresh.

// Khóa xem 1 máy (dùng trong ?xem=<khóa>): ô Máy -> "may-N" (may-1..may-6);
// máy theo tên -> idMay đã làm sạch (ví dụ "id_abc123").
function khoaXemMay(m) {
  if (m.loai === 'ten') return String(m.idMay || '');
  return 'may-' + String(m.may).replace(/\D/g, '');
}

// Máy này đã gửi dữ liệu gì chưa? (cùng luật với theMayMayChu)
// Phiên bản 20: thêm soAnh/coAmThanh để danh sách NHẸ (không tải ảnh/
// âm thanh, chỉ đếm file) vẫn nhận đúng máy nào có dữ liệu.
// Phiên bản 21: thêm coDuLieu (mục khôi phục từ file chỉ mục
// danh-sach-may.json — chỉ mục chỉ ghi máy đã có dữ liệu).
function mayCoDuLieu(m) {
  return (m.ten && m.ten !== '') || (m.soDienThoai && m.soDienThoai !== '') ||
    (m.viTri && m.viTri !== '') || (m.danhBa && m.danhBa.length > 0) ||
    (m.anh && m.anh.length > 0) || (m.tomTat && m.tomTat !== '') ||
    !!m.thoiGianDungApp || (m.amThanh && m.amThanh !== '') ||
    (m.soAnh && m.soAnh > 0) || !!m.coAmThanh || !!m.coDuLieu;
}

// Có máy nào đã gửi dữ liệu không?
function coMayNaoGui(danhSach) {
  for (var i = 0; i < danhSach.length; i++) {
    if (mayCoDuLieu(danhSach[i])) return true;
  }
  return false;
}

// Vị trí (chỉ số) của máy gửi GẦN NHẤT trong danh sách (theo thoiGianGui,
// tính trên CẢ ô Máy lẫn máy theo tên). Trả về -1 nếu không máy nào gửi.
// (Chuỗi ISO so sánh được theo thứ tự thời gian.)
function chiSoMayMoiNhat(danhSach) {
  var moiNhat = -1;
  var moiNhatThoiGian = '';
  for (var q = 0; q < danhSach.length; q++) {
    var tg = danhSach[q].thoiGianGui || '';
    if (tg !== '' && (moiNhatThoiGian === '' || tg > moiNhatThoiGian)) {
      moiNhatThoiGian = tg;
      moiNhat = q;
    }
  }
  return moiNhat;
}

// Mốc thời gian (ms) từ thoiGianGui (chuỗi ISO). Thiếu hoặc không đọc
// được thì coi là 0 (cũ nhất) để xếp xuống cuối menu.
function mocThoiGianGui(iso) {
  if (!iso) return 0;
  var t = new Date(iso).getTime();
  return isNaN(t) ? 0 : t;
}

// Xếp danh sách máy cho MENU theo thời gian gửi GIẢM DẦN: máy gửi mới
// nhất lên trên cùng, máy chưa gửi (không có thoiGianGui) xuống cuối.
// Cùng thời gian thì giữ thứ tự cũ (ô Máy theo số, máy theo tên theo A-Z).
// Trả về mảng mới, không đổi thứ tự của mảng gốc (lưới "Xem tất cả" và
// trang chi tiết giữ nguyên thứ tự cũ).
function sapXepMenuTheoThoiGian(danhSach) {
  var ds = danhSach.slice();
  ds.sort(function(a, b) {
    var ta = mocThoiGianGui(a.thoiGianGui);
    var tb = mocThoiGianGui(b.thoiGianGui);
    if (ta !== tb) return tb - ta;
    var la = a.loai === 'ten' ? 1 : 0;
    var lb = b.loai === 'ten' ? 1 : 0;
    if (la !== lb) return la - lb;
    if (la === 1) {
      var ta2 = String(a.tenMay || a.may || '');
      var tb2 = String(b.tenMay || b.may || '');
      return ta2 < tb2 ? -1 : (ta2 > tb2 ? 1 : 0);
    }
    return parseInt(String(a.may).replace(/\D/g, ''), 10) - parseInt(String(b.may).replace(/\D/g, ''), 10);
  });
  return ds;
}

// Tên hiển thị của 1 máy trên menu / trang chi tiết.
function tenHienThiMay(m) {
  if (m.loai === 'ten') return m.tenMay || m.may || 'Máy theo tên';
  return m.may;
}

// CSS dùng chung cho trang trình chiếu (menu / chi tiết / xem tất cả).
var CSS_TRINH_CHIEU = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #0b0b0d; color: #f3f4f6; }
  .dau { padding: 22px 24px 16px; background: linear-gradient(180deg, #161618, #0b0b0d); border-bottom: 3px solid #f59e0b; }
  h1 { font-size: 34px; margin: 0 0 6px; color: #fbbf24; letter-spacing: 1px; }
  .dau h1::before { content: ''; display: inline-block; width: 14px; height: 14px; background: #f59e0b; border-radius: 3px; margin-right: 12px; vertical-align: 2px; }
  .trang-thai { font-size: 16px; color: #a1a1aa; }
  .khung { padding: 12px 24px 24px; }
  .luoi-may { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px; align-items: start; }
  .the-may { background: #17181c; border: 1px solid #2e2f36; border-radius: 16px; padding: 18px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.4); }
  .the-may.trong { opacity: 0.55; }
  .nhan-may { font-size: 28px; font-weight: 800; color: #fbbf24; margin-bottom: 10px; }
  .the-may.trong .nhan-may { color: #9ca3af; }
  .huy-hieu-dang-dung { display: inline-block; background: #16a34a; color: #fff; border-radius: 999px; padding: 6px 14px; font-size: 16px; font-weight: 800; letter-spacing: 1px; margin-bottom: 8px; }
  .gio-gui { font-size: 15px; color: #9ca3af; margin-bottom: 6px; }
  .bang-app { width: 100%; border-collapse: collapse; margin-top: 8px; }
  .bang-app td { font-size: 19px; padding: 8px 6px; border-top: 1px solid #374151; }
  .bang-app tr.tong td { font-weight: 800; border-top: 2px solid #6b7280; }
  .ghi-chu-gia-lap { color: #9ca3af; font-size: 15px; margin-top: 4px; }
  .hang-thong-tin { margin: 12px 0; }
  .nhan { font-size: 14px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
  .gia-tri { font-size: 26px; font-weight: 700; margin-top: 4px; line-height: 1.3; }
  .gia-tri.nho { font-size: 20px; }
  .link-map { color: #60a5fa; text-decoration: underline; }
  .ds-danh-ba { list-style: none; margin: 8px 0 0; padding: 0; }
  .ds-danh-ba li { font-size: 20px; font-weight: 600; padding: 8px 0; border-top: 1px solid #374151; }
  .tom-tat { white-space: pre-wrap; font-size: 20px; line-height: 1.6; background: #111827; border: 1px solid #374151; border-radius: 12px; padding: 14px 16px; margin-top: 8px; }
  .hang-thong-tin audio { width: 100%; margin-top: 8px; }
  .chu-thich-am-thanh { color: #9ca3af; margin-top: 6px; font-size: 18px; }
  .luoi-anh { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-top: 12px; }
  .luoi-anh img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 12px; display: block; background: #222; }
  .chu-thich-anh { color: #9ca3af; margin-top: 8px; font-size: 18px; }
  .xem-anh { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.93); z-index: 999; padding: 24px; text-align: center; overflow: auto; }
  .xem-anh:target { display: block; }
  .xem-anh img { max-width: 94vw; max-height: 76vh; border-radius: 12px; margin: 12px auto; display: block; }
  .dong-xem { display: inline-block; background: #ef4444; color: #fff; border-radius: 10px; padding: 12px 20px; font-size: 18px; font-weight: 700; text-decoration: none; }
  .ten-anh { color: #e5e7eb; font-size: 18px; margin: 10px 0 14px; }
  .hang-tai { margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; }
  .nut-tai { background: #2563eb; color: #fff; border: 0; border-radius: 10px; padding: 12px 18px; font-size: 18px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-block; }
  .nut-tai:hover { background: #1d4ed8; }
  .nut-xoa { background: transparent; color: #f87171; border: 1.5px solid #ef4444; border-radius: 10px; padding: 10px 16px; font-size: 17px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-block; }
  .nut-xoa:hover { background: #7f1d1d; color: #fff; }
  .hop-xanh { background: #14532d; border: 1px solid #22c55e; border-radius: 14px; padding: 18px 20px; margin: 20px 0 0; font-size: 20px; line-height: 1.5; }
  .cau-hoi { background: #1e3a5f; border: 1px solid #3b82f6; border-radius: 14px; padding: 18px 20px; margin: 12px 0 0; font-size: 20px; line-height: 1.6; }
  .cau-hoi b { color: #fbbf24; }
  .trong { padding: 80px 20px; text-align: center; font-size: 24px; color: #9ca3af; line-height: 1.6; }
  .menu-may { max-width: 760px; margin: 0 auto; }
  .hang-menu { position: relative; display: block; background: #17181c; border: 1px solid #2e2f36; border-radius: 16px; padding: 22px 24px; margin: 0 0 14px; text-decoration: none; color: #f3f4f6; box-shadow: 0 2px 10px rgba(0,0,0,0.4); }
  .hang-menu:hover { border-color: #f59e0b; }
  .hang-menu.trong { opacity: 0.55; }
  .ten-menu { font-size: 28px; font-weight: 800; color: #fbbf24; padding-right: 175px; }
  .moc-thoi-gian { position: absolute; top: 14px; right: 16px; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; color: #9ca3af; white-space: nowrap; }
  .hang-menu.trong .ten-menu { color: #9ca3af; }
  .gio-menu { font-size: 22px; font-weight: 700; color: #e5e7eb; margin-top: 8px; }
  .hang-menu.trong .gio-menu { color: #9ca3af; font-weight: 400; }
  .xem-tat-ca { display: block; background: #2563eb; color: #fff; border-radius: 14px; padding: 18px 22px; margin: 8px 0 0; font-size: 22px; font-weight: 800; text-align: center; text-decoration: none; }
  .xem-tat-ca:hover { background: #1d4ed8; }
  .nut-quay-lai { display: inline-block; background: #374151; color: #fff; border-radius: 10px; padding: 12px 18px; font-size: 18px; font-weight: 700; text-decoration: none; margin: 10px 10px 0 0; }
  .nut-quay-lai:hover { background: #4b5563; }
  .chan-trang { padding: 24px; text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #26272c; }
  .thanh-tab { display: flex; gap: 10px; padding: 16px 24px 0; background: #0b0b0d; position: sticky; top: 0; z-index: 50; }
  .nut-tab { flex: 1; text-align: center; padding: 18px 10px; font-size: 24px; font-weight: 800; color: #9ca3af; background: #17181c; border: 2px solid #2e2f36; border-bottom: none; border-radius: 16px 16px 0 0; text-decoration: none; line-height: 1.25; }
  .nut-tab:hover { color: #e5e7eb; border-color: #f59e0b; }
  .nut-tab.dang-chon { background: #f59e0b; border-color: #f59e0b; color: #111; }
`;

// PHIÊN BẢN 25 — THANH TAB 3 TAB (trang chủ thống nhất):
//   "📦 Hộp đen" | "🔔 Bấm chuông" | "🔍 Đội điều tra".
// Mỗi tab là 1 link (target="_top") nạp lại trang với tham số của tab đó;
// máy chủ vẽ sẵn đúng tab (KHÔNG nạp cả 3 tab cùng lúc — đỡ nặng, đỡ lag).
// tabDangChon: 'hopden' | 'buzzer' | 'dieutra'.
function thanhTab(tabDangChon) {
  function nutTab(nhan, url, dangChon) {
    return '<a class="nut-tab' + (dangChon ? ' dang-chon' : '') + '" target="_top" href="' + escHtml(url) + '">' + nhan + '</a>';
  }
  return '<div class="thanh-tab">' +
    nutTab('📦 Hộp đen', URL_WEB_APP, tabDangChon === 'hopden') +
    nutTab('🔔 Bấm chuông', URL_WEB_APP + '?tab=buzzer', tabDangChon === 'buzzer') +
    nutTab('🔍 Đội điều tra', URL_WEB_APP + '?tab=dieutra', tabDangChon === 'dieutra') +
    '</div>';
}

// Mở đầu trang trình chiếu: doctype + head + CSS + tiêu đề + dòng trạng thái
// + link "← Quay lại menu" (nếu có) + nút "Làm mới trang".
// linkQuayLai là '' (trang menu) hoặc HTML của link quay lại.
function moDauTrangTrinhChieu(tieuDe, trangThai, urlLamMoi, linkQuayLai) {
  return '<!DOCTYPE html>\n<html lang="vi">\n<head>\n<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + escHtml(tieuDe) + '</title>\n<style>\n' + CSS_TRINH_CHIEU + '</style>\n</head>\n<body>\n' + thanhTab('hopden') +
    '<div class="dau"><h1>' + escHtml(tieuDe) + '</h1><div class="trang-thai">' + escHtml(trangThai) + '</div>' +
    '<div style="margin-top:10px;">' + linkQuayLai + '<a class="nut-tai" target="_top" href="' + escHtml(urlLamMoi) + '">Làm mới trang</a></div></div>\n';
}

// Cuối trang trình chiếu: chân trang ghi phiên bản + đóng thẻ.
function dongTrangTrinhChieu() {
  return '<div class="chan-trang">Trình chiếu Avatar AI — Phiên bản 25 (22/11/2026)</div>\n</body>\n</html>';
}

// Hộp xanh + câu hỏi cho lớp (hiện dưới thẻ máy, chỉ khi máy đã có dữ liệu).
function hopXanhVaCauHoi() {
  var hopXanh = '<div class="hop-xanh">Đây là demo trên máy thầy — thầy tự cho phép. Camera, vị trí, ảnh và danh bạ ở trên đều là thật trên máy thầy và chỉ hiện trên máy này, không gửi đi đâu, không lưu lại — đóng trang là mất. Học sinh chơi ở chế độ riêng, hoàn toàn giả lập.</div>';
  var cauHoi = '<div class="cau-hoi"><b>Nếu đây là app thật thì sao?</b> Thầy vừa tự tay cho phép hết trên máy của mình. Nếu một app lạ cũng xin như vậy trên máy học sinh — và các em cũng bấm Cho phép nhanh như thầy vừa bấm — thì người lạ sẽ có đúng những thứ này của các em. Cả lớp nghĩ sao?</div>';
  return hopXanh + cauHoi;
}

// Trang MENU (mặc định): danh sách các máy, mỗi dòng hiện tên máy + giờ gửi.
// Bấm 1 dòng -> trang chi tiết của máy đó (?xem=<khóa>).
// (Phiên bản 22: dùng layDanhSachMenuNhanh — cache 60 giây hoặc 1 file
//  chỉ mục duy nhất — nên menu mở rất nhanh. Menu CHỈ hiện ĐÚNG 6 máy
//  gửi GẦN NHẤT (mới nhất lên trên); máy cũ hơn ẩn khỏi menu nhưng KHÔNG
//  bị xóa — "Xem tất cả" và trang chi tiết vẫn xem được máy cũ. Thay thế
//  luật 60 phút của bản 21.)
function taoTrangMenu() {
  var d = layDanhSachMenuNhanh();
  var danhSach = sapXepMenuTheoThoiGian((d && d.may) || []);
  // Chỉ giữ máy ĐÃ CÓ dữ liệu, xếp mới nhất lên trên, lấy ĐÚNG 6 máy
  // đầu (ô trống "chưa có thông tin" không hiện; máy cũ hơn ẩn khỏi
  // menu nhưng KHÔNG bị xóa — "Xem tất cả" vẫn xem được).
  var danhSachMoi = [];
  for (var k = 0; k < danhSach.length && danhSachMoi.length < 6; k++) {
    var mm = danhSach[k];
    if (!mayCoDuLieu(mm)) continue;
    danhSachMoi.push(mm);
  }
  var moiNhat = chiSoMayMoiNhat(danhSachMoi);
  var trangThai, noiDung;
  if (d && d.loi) {
    trangThai = 'Không tải được thông tin: ' + d.loi;
    noiDung = '<div class="trong">Không tải được thông tin.<br>' + escHtml(d.loi) + '</div>';
  } else if (danhSachMoi.length === 0) {
    trangThai = 'Bấm "Xem tất cả" để xem dữ liệu các máy.';
    noiDung = '<div class="khung"><div class="menu-may">' +
      '<div class="trong">Chưa có máy nào gửi.</div>' +
      '<a class="xem-tat-ca" target="_top" href="' + escHtml(URL_WEB_APP) + '?xem=tat-ca">Xem tất cả</a></div></div>';
  } else {
    trangThai = '6 máy gửi gần nhất — bấm vào một máy để xem chi tiết. Bấm "Xem tất cả" để xem máy cũ hơn.';
    var hang = '';
    for (var i = 0; i < danhSachMoi.length; i++) {
      var m = danhSachMoi[i];
      hang += '<a class="hang-menu" target="_top" href="' + escHtml(URL_WEB_APP) + '?xem=' + escHtml(encodeURIComponent(khoaXemMay(m))) + '">';
      hang += '<div class="ten-menu">' + escHtml(tenHienThiMay(m)) + '</div>';
      if (i === moiNhat) hang += '<div style="margin-top:8px;"><span class="huy-hieu-dang-dung">ĐANG DÙNG</span></div>';
      if (m.thoiGianGui && m.thoiGianGui !== '') {
        hang += '<div class="moc-thoi-gian">' + escHtml(dinhDangThoiGianGui(m.thoiGianGui)) + '</div>';
      }
      hang += '</a>';
    }
    noiDung = '<div class="khung"><div class="menu-may">' + hang +
      '<a class="xem-tat-ca" target="_top" href="' + escHtml(URL_WEB_APP) + '?xem=tat-ca">Xem tất cả</a></div></div>';
  }
  return moDauTrangTrinhChieu('HỘP ĐEN THU THẬP DỮ LIỆU NGƯỜI DÙNG', trangThai, URL_WEB_APP, '') + noiDung + dongTrangTrinhChieu();
}

// Trang CHI TIẾT 1 máy (?xem=<khóa>): chỉ thẻ của máy đó + hộp xanh + câu hỏi.
// (Phiên bản 21: dùng layDanhSachMenuNhanh — cache / chỉ mục — thay cho
//  layDanhSachMayNhe; vẫn chỉ tải ĐẦY ĐỦ dữ liệu của ĐÚNG 1 máy đó
//  layThongTinMotMay. Huy hiệu "ĐANG DÙNG" tính bằng danh sách nhẹ.)
function taoTrangChiTietMay(khoa) {
  var d = layDanhSachMenuNhanh();
  var danhSach = (d && d.may) || [];
  var moiNhat = chiSoMayMoiNhat(danhSach);
  var linkQuayLai = '<a class="nut-quay-lai" target="_top" href="' + escHtml(URL_WEB_APP) + '">← Quay lại menu</a>';
  var urlLamMoi = URL_WEB_APP + '?xem=' + encodeURIComponent(khoa);
  if (d && d.loi) {
    return moDauTrangTrinhChieu('HỘP ĐEN THU THẬP DỮ LIỆU NGƯỜI DÙNG', 'Không tải được thông tin: ' + d.loi, urlLamMoi, linkQuayLai) +
      '<div class="trong">Không tải được thông tin.<br>' + escHtml(d.loi) + '</div>' + dongTrangTrinhChieu();
  }
  var mNhe = null, idx = -1;
  for (var i2 = 0; i2 < danhSach.length; i2++) {
    if (khoaXemMay(danhSach[i2]) === khoa) { mNhe = danhSach[i2]; idx = i2; break; }
  }
  if (!mNhe) {
    return moDauTrangTrinhChieu('HỘP ĐEN THU THẬP DỮ LIỆU NGƯỜI DÙNG', 'Không tìm thấy máy này.', urlLamMoi, linkQuayLai) +
      '<div class="trong">Không tìm thấy máy này.<br>Bấm "← Quay lại menu" để xem danh sách máy.</div>' + dongTrangTrinhChieu();
  }
  var m = layThongTinMotMay(khoa, mNhe);
  if (!m) {
    return moDauTrangTrinhChieu('HỘP ĐEN THU THẬP DỮ LIỆU NGƯỜI DÙNG', 'Không tìm thấy máy này.', urlLamMoi, linkQuayLai) +
      '<div class="trong">Không tìm thấy máy này.<br>Bấm "← Quay lại menu" để xem danh sách máy.</div>' + dongTrangTrinhChieu();
  }
  var tieuDe = tenHienThiMay(m);
  var phanDuoi = mayCoDuLieu(m) ? hopXanhVaCauHoi() : '';
  return moDauTrangTrinhChieu('HỘP ĐEN THU THẬP DỮ LIỆU NGƯỜI DÙNG', 'Bấm F5 hoặc nút "Làm mới trang" để xem máy mới gửi.', urlLamMoi, linkQuayLai) +
    '<div class="khung">' + theMayMayChu(m, idx === moiNhat) + phanDuoi + '</div>' + dongTrangTrinhChieu();
}

// Vẽ toàn bộ trang trình chiếu phía máy chủ (đã có dữ liệu, không cần gọi lại).
// Chế độ "xem tất cả": lưới tất cả các thẻ máy (như trước) + link quay lại menu.
function taoTrangTrinhChieu() {
  var d = layThongTinTatCaMay();
  var danhSach = (d && d.may) || [];
  var moiNhat = chiSoMayMoiNhat(danhSach);
  var linkQuayLai = '<a class="nut-quay-lai" target="_top" href="' + escHtml(URL_WEB_APP) + '">← Quay lại menu</a>';
  var urlLamMoi = URL_WEB_APP + '?xem=tat-ca';
  var trangThai, noiDung;
  if (d && d.loi) {
    trangThai = 'Không tải được thông tin: ' + d.loi;
    noiDung = '<div class="trong">Không tải được thông tin.<br>' + escHtml(d.loi) + '</div>';
  } else if (!coMayNaoGui(danhSach)) {
    trangThai = 'Chưa có thông tin.';
    noiDung = '<div class="trong">Chưa có thông tin.<br>Thầy bấm "Đăng ký" trên điện thoại.</div>';
  } else {
    trangThai = 'Đang chiếu thông tin của các máy. Bấm F5 hoặc nút "Làm mới trang" để xem máy mới gửi.';
    var the = '';
    for (var j = 0; j < danhSach.length; j++) the += theMayMayChu(danhSach[j], j === moiNhat);
    noiDung = '<div class="khung"><div class="luoi-may">' + the + '</div>' + hopXanhVaCauHoi() + '</div>';
  }
  return moDauTrangTrinhChieu('HỘP ĐEN THU THẬP DỮ LIỆU NGƯỜI DÙNG', trangThai, urlLamMoi, linkQuayLai) + noiDung + dongTrangTrinhChieu();
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  // PHIÊN BẢN 25 — 3 TAB: bí danh ?tab=hopden / ?tab=buzzer / ?tab=dieutra
  // (tương đương ?hd3= cũ, vẫn chạy). Tham số hd3 kiểm tra TRƯỚC các
  // nhánh cũ bên dưới. Trang host vẽ sẵn phía máy chủ, không dùng
  // google.script.run, không meta refresh — thầy bấm "Làm mới trang".
  if (!p.hd3 && p.tab === 'buzzer') p.hd3 = 'buzzer';
  if (!p.hd3 && p.tab === 'dieutra') p.hd3 = 'dieutra';
  //   ?hd3=buzzer                 -> trang host chuông bấm nhanh
  //   ?hd3=buzzer&hanhdong=mo&vong=N -> mở Câu N (chuông mở, ghi armedAt)
  //   ?hd3=buzzer&hanhdong=khoa  -> khóa chuông (lượt bấm sau bị bỏ qua)
  //   ?hd3=buzzer&hanhdong=datlai -> XÓA HẾT lượt bấm CẢ 4 câu + khóa chuông
  //   ?hd3=dieutra               -> trang host điều tra + nhận xét
  if (p.hd3 === 'buzzer') {
    if (p.hanhdong === 'mo') {
      var vongMo = chuanHoaVongHD3(p.vong);
      if (vongMo !== 0) ghiTrangThaiHD3({ currentRound: vongMo, armed: true, armedAt: new Date().toISOString() });
    } else if (p.hanhdong === 'khoa') {
      var ttKhoa = docTrangThaiHD3();
      ttKhoa.armed = false;
      ghiTrangThaiHD3(ttKhoa);
    } else if (p.hanhdong === 'datlai') {
      ghiJsonHD3(TEN_FILE_BUZZER_HD3, []);
      var ttDatLai = docTrangThaiHD3();
      ttDatLai.armed = false;
      ghiTrangThaiHD3(ttDatLai);
    }
    return HtmlService.createHtmlOutput(taoTrangBuzzerHD3())
      .setTitle('HĐ3 — Chuông bấm nhanh')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  if (p.hd3 === 'dieutra') {
    return HtmlService.createHtmlOutput(taoTrangDieuTraHD3())
      .setTitle('HĐ3 — Điều tra')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  // Xóa dữ liệu 1 máy (Phiên bản 15) — hai bước, không dùng JavaScript:
  //   ?action=xoa&id=<id>            -> trang xác nhận (chưa xóa gì)
  //   ?action=xoa&id=<id>&xacNhan=1  -> xóa thật rồi hiện kết quả
  if (p.action === 'xoa' && p.id) {
    var nhanXoa = nhanMayDeXoa(p.id);
    if (p.xacNhan === '1') {
      var ketQuaXoa = xoaDuLieuMotMay(p.id);
      // Phiên bản 21: gỡ máy khỏi file chỉ mục + xóa cache menu (best-effort).
      try { xoaMayKhoiChiMuc(p.id); } catch (loiChiMucXoa) {}
      return HtmlService.createHtmlOutput(taoTrangKetQuaXoa(ketQuaXoa.timThay, ketQuaXoa.nhan || nhanXoa))
        .setTitle('Đã xóa dữ liệu')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
    }
    return HtmlService.createHtmlOutput(taoTrangXacNhanXoa(p.id, nhanXoa))
      .setTitle('Xác nhận xóa dữ liệu')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  var page = p.page || '';
  if (page === 'gui') {
    return HtmlService.createHtmlOutput(TRANG_GUI_ANH)
      .setTitle('Gửi thông tin lên laptop')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  // Trang trình chiếu (Phiên bản 22): MENU là mặc định (chỉ 6 máy gửi gần nhất).
  //   (không tham số) -> menu danh sách máy (tên + giờ gửi)
  //   ?xem=tat-ca    -> xem tất cả các thẻ cùng lúc (lưới như trước)
  //   ?xem=<khóa>     -> chi tiết 1 máy (khóa "may-N" hoặc idMay)
  var xem = p.xem || '';
  if (xem === 'tat-ca') {
    return HtmlService.createHtmlOutput(taoTrangTrinhChieu())
      .setTitle('HỘP ĐEN THU THẬP DỮ LIỆU NGƯỜI DÙNG')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  if (xem !== '') {
    return HtmlService.createHtmlOutput(taoTrangChiTietMay(xem))
      .setTitle('HỘP ĐEN THU THẬP DỮ LIỆU NGƯỜI DÙNG')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  return HtmlService.createHtmlOutput(taoTrangMenu())
    .setTitle('HỘP ĐEN THU THẬP DỮ LIỆU NGƯỜI DÙNG')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}


// ============================================================================
//  TRANG GỬI THÔNG TIN (mở trên điện thoại của thầy)
//  Thầy chọn máy, nhập tên, số, vị trí, chọn ảnh, thêm danh bạ rồi bấm Gửi 1 cái:
//  toàn bộ đi lên Drive của thầy trong 1 lần, chỉ thay dữ liệu của đúng máy đó.
// ============================================================================
var TRANG_GUI_ANH = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Gửi thông tin lên laptop</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #eef2f7; color: #1f2937; }
  .hop { max-width: 480px; margin: 0 auto; padding: 20px 16px 32px; }
  h1 { font-size: 26px; margin: 8px 0 4px; }
  .phu { color: #6b7280; font-size: 15px; margin: 0 0 20px; }
  label { display: block; font-size: 15px; font-weight: 600; margin: 16px 0 6px; }
  .o-nhap { display: block; width: 100%; min-height: 48px; padding: 10px 12px; font-size: 16px; border: 1px solid #d1d5db; border-radius: 10px; background: #fff; color: #1f2937; }
  .hang { display: flex; gap: 8px; }
  .hang .o-nhap { flex: 1; min-width: 0; }
  .chon-may { display: flex; gap: 8px; flex-wrap: wrap; }
  .nut-may { flex: 1; min-width: 80px; min-height: 52px; border: 2px solid #2563eb; background: #fff; color: #2563eb; border-radius: 12px; font-size: 17px; font-weight: 700; cursor: pointer; }
  .nut-may.duoc-chon { background: #2563eb; color: #fff; }
  .nut { display: block; width: 100%; min-height: 56px; border: none; border-radius: 14px; font-size: 18px; font-weight: 700; cursor: pointer; margin: 10px 0; }
  .nut-chon { background: #2563eb; color: #fff; }
  .nut-gui { background: #16a34a; color: #fff; }
  .nut-gui:disabled { background: #9ca3af; cursor: not-allowed; }
  .nut-them { background: #fff; color: #2563eb; border: 2px solid #2563eb; min-height: 48px; font-size: 16px; }
  .dem { font-size: 16px; margin: 12px 0 4px; font-weight: 600; }
  .luoi { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 8px 0; }
  .luoi img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 10px; display: block; }
  .ds-danh-ba { list-style: none; margin: 8px 0; padding: 0; }
  .ds-danh-ba li { display: flex; justify-content: space-between; align-items: center; gap: 8px; background: #fff; border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; margin: 6px 0; font-size: 16px; }
  .ds-danh-ba button { border: none; background: none; color: #dc2626; font-size: 16px; font-weight: 700; cursor: pointer; padding: 4px 8px; }
  .trang-thai { font-size: 16px; line-height: 1.5; margin: 14px 0; padding: 12px; border-radius: 10px; background: #fff; border: 1px solid #d1d5db; }
  .ghi-chu { font-size: 14px; color: #6b7280; line-height: 1.5; }
</style>
</head>
<body>
<div class="hop">
  <h1>Gửi thông tin lên laptop</h1>
  <p class="phu">Thông tin của thầy — chỉ lưu trong Google Drive của thầy. Thầy chọn máy, nhập xong, bấm Gửi 1 cái là laptop hiện đủ.</p>

  <label>Máy của thầy (chọn số máy của điện thoại này)</label>
  <div class="chon-may" id="chonMay">
    <button class="nut-may duoc-chon" type="button" id="nutMay1" onclick="chonMay(1)">Máy 1</button>
    <button class="nut-may" type="button" id="nutMay2" onclick="chonMay(2)">Máy 2</button>
    <button class="nut-may" type="button" id="nutMay3" onclick="chonMay(3)">Máy 3</button>
    <button class="nut-may" type="button" id="nutMay4" onclick="chonMay(4)">Máy 4</button>
    <button class="nut-may" type="button" id="nutMay5" onclick="chonMay(5)">Máy 5</button>
  </div>

  <label for="oTen">Họ và tên</label>
  <input class="o-nhap" type="text" id="oTen" placeholder="Tên của thầy — ví dụ: Phạm Ngọc Hưng" autocomplete="off">

  <label for="oSo">Số điện thoại</label>
  <input class="o-nhap" type="tel" id="oSo" placeholder="Số điện thoại của thầy" autocomplete="off">

  <label for="oViTri">Vị trí</label>
  <input class="o-nhap" type="text" id="oViTri" placeholder="Vị trí — ví dụ: 10.1234, 106.5678 (để trống nếu không muốn gửi)" autocomplete="off">

  <label>Ảnh của thầy</label>
  <input type="file" id="chonAnh" accept="image/*" multiple style="display:none">
  <button class="nut nut-chon" type="button" onclick="chonAnh()">Chọn ảnh từ máy thầy</button>
  <div class="dem" id="demAnh">Chưa chọn ảnh nào.</div>
  <div class="luoi" id="xemTruoc"></div>

  <label>Danh bạ (chỉ 1-2 người thầy thoải mái cho cả lớp thấy)</label>
  <div class="hang">
    <input class="o-nhap" type="text" id="oTenDanhBa" placeholder="Tên — ví dụ: Thầy Hưng" autocomplete="off">
    <input class="o-nhap" type="tel" id="oSoDanhBa" placeholder="Số" autocomplete="off">
  </div>
  <button class="nut nut-them" type="button" onclick="themDanhBa()">+ Thêm người này vào danh sách</button>
  <ul class="ds-danh-ba" id="dsDanhBa"></ul>

  <button class="nut nut-gui" type="button" id="nutGui" onclick="guiThongTin()">Gửi toàn bộ thông tin lên laptop</button>
  <div class="trang-thai" id="trangThai">Thầy chọn máy, nhập thông tin, chọn ảnh, thêm danh bạ (nếu muốn) rồi bấm "Gửi toàn bộ thông tin lên laptop".</div>
  <p class="ghi-chu">Mỗi điện thoại chọn số máy của mình trước khi gửi. Gửi mới chỉ thay dữ liệu của đúng máy đó, các máy khác vẫn còn. Thông tin chỉ lưu trong thư mục "Anh trinh chieu Avatar AI" trên Drive của thầy.</p>
</div>
<script>
  var anhDaChon = [];
  var anhDaNen = [];
  var danhBa = [];
  var mayDaChon = 1;

  function lay(id) { return document.getElementById(id); }

  function chonMay(so) {
    mayDaChon = so;
    for (var i = 1; i <= 5; i++) {
      var nut = lay('nutMay' + i);
      if (i === so) {
        nut.className = 'nut-may duoc-chon';
      } else {
        nut.className = 'nut-may';
      }
    }
  }

  function chonAnh() {
    lay('chonAnh').click();
  }

  lay('chonAnh').addEventListener('change', function(ev) {
    var files = ev.target.files;
    anhDaChon = [];
    var xemTruoc = lay('xemTruoc');
    xemTruoc.innerHTML = '';
    for (var i = 0; i < files.length; i++) {
      anhDaChon.push(files[i]);
      var img = document.createElement('img');
      img.src = URL.createObjectURL(files[i]);
      img.alt = files[i].name;
      xemTruoc.appendChild(img);
    }
    lay('demAnh').textContent = anhDaChon.length === 0 ? 'Chưa chọn ảnh nào.' : 'Đã chọn ' + anhDaChon.length + ' ảnh.';
  });

  function themDanhBa() {
    var ten = lay('oTenDanhBa').value.trim();
    var so = lay('oSoDanhBa').value.trim();
    if (ten === '' && so === '') return;
    danhBa.push({ ten: ten, so: so });
    lay('oTenDanhBa').value = '';
    lay('oSoDanhBa').value = '';
    hienDanhBa();
  }

  function hienDanhBa() {
    var ds = lay('dsDanhBa');
    ds.innerHTML = '';
    for (var i = 0; i < danhBa.length; i++) {
      (function(chiSo) {
        var li = document.createElement('li');
        var chu = document.createElement('span');
        chu.textContent = danhBa[chiSo].ten + (danhBa[chiSo].so ? ' — ' + danhBa[chiSo].so : '');
        var xoa = document.createElement('button');
        xoa.type = 'button';
        xoa.textContent = 'Xóa';
        xoa.onclick = function() {
          danhBa.splice(chiSo, 1);
          hienDanhBa();
        };
        li.appendChild(chu);
        li.appendChild(xoa);
        ds.appendChild(li);
      })(i);
    }
  }

  function datTrangThai(chu) {
    lay('trangThai').textContent = chu;
  }

  // Nén ảnh về tối đa 800px, JPEG 0.7 để gửi nhanh hơn.
  function nenAnh(file, xong) {
    var reader = new FileReader();
    reader.onload = function(ev) {
      var img = new Image();
      img.onload = function() {
        var tiLe = Math.min(1, 800 / img.width);
        var w = Math.max(1, Math.round(img.width * tiLe));
        var h = Math.max(1, Math.round(img.height * tiLe));
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        var duLieu = canvas.toDataURL('image/jpeg', 0.7);
        xong({ ten: file.name, duLieu: duLieu.split(',')[1] });
      };
      img.onerror = function() { xong(null); };
      img.src = ev.target.result;
    };
    reader.onerror = function() { xong(null); };
    reader.readAsDataURL(file);
  }

  function guiThongTin() {
    var nut = lay('nutGui');
    nut.disabled = true;
    datTrangThai('Đang gửi toàn bộ thông tin của Máy ' + mayDaChon + ', thầy chờ một chút...');
    anhDaNen = [];
    nenTungAnh(0);
  }

  function nenTungAnh(chiSo) {
    if (chiSo >= anhDaChon.length) {
      guiLenMayChu();
      return;
    }
    nenAnh(anhDaChon[chiSo], function(ketQua) {
      if (ketQua) anhDaNen.push(ketQua);
      nenTungAnh(chiSo + 1);
    });
  }

  function guiLenMayChu() {
    var soNguoi = danhBa.length;
    var goi = {
      may: 'Máy ' + mayDaChon,
      ten: lay('oTen').value.trim(),
      soDienThoai: lay('oSo').value.trim(),
      viTri: lay('oViTri').value.trim(),
      danhBa: danhBa,
      anh: anhDaNen
    };
    google.script.run
      .withSuccessHandler(function(ketQua) {
        var soAnh = (ketQua && typeof ketQua === 'object') ? ketQua.soAnh : ketQua;
        var tenMay = (ketQua && typeof ketQua === 'object' && ketQua.soMay) ? ('Máy ' + ketQua.soMay) : ('Máy ' + mayDaChon);
        datTrangThai('Đã gửi toàn bộ thông tin của ' + tenMay + ' (' + soAnh + ' ảnh, ' + soNguoi + ' người trong danh bạ) — mở trang trình chiếu trên laptop để xem.');
        lay('nutGui').disabled = false;
        lay('oTen').value = '';
        lay('oSo').value = '';
        lay('oViTri').value = '';
        anhDaChon = [];
        lay('xemTruoc').innerHTML = '';
        lay('chonAnh').value = '';
        lay('demAnh').textContent = 'Chưa chọn ảnh nào.';
        danhBa = [];
        hienDanhBa();
      })
      .withFailureHandler(function(loi) {
        datTrangThai('Gửi chưa được, thầy thử lại nhé. (' + loi.message + ')');
        lay('nutGui').disabled = false;
      })
      .luuThongTin(goi);
  }
</script>
</body>
</html>`;

// ============================================================================
//  TRANG TRÌNH CHIẾU (mở trên laptop của thầy, chiếu lên TV)
//  Lưới LINH HOẠT hiện CẢ 4-5 MÁY CÙNG LÚC (tự co giãn theo số máy):
//  mỗi ô 1 máy với tên, số, ảnh to, vị trí (bấm mở Google Maps), danh bạ.
//  Ô máy nào chưa gửi thì hiện "Máy N — chưa có thông tin".
//  Tự làm mới mỗi 2 giây: hỏi máy chủ có dữ liệu mới không, có thì mới tải về.
// ============================================================================
var TRANG_TRINH_CHIEU = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trình chiếu thông tin Avatar AI</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #111; color: #f3f4f6; }
  .dau { padding: 20px 24px 8px; }
  h1 { font-size: 30px; margin: 0 0 4px; }
  .trang-thai { font-size: 15px; color: #9ca3af; }
  .khung { padding: 12px 24px 24px; }
  .luoi-may { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px; align-items: start; }
  .the-may { background: #1f2937; border: 1px solid #374151; border-radius: 14px; padding: 18px 20px; }
  .the-may.trong { opacity: 0.55; }
  .nhan-may { font-size: 28px; font-weight: 800; color: #fbbf24; margin-bottom: 10px; }
  .the-may.trong .nhan-may { color: #9ca3af; }
  .hang-thong-tin { margin: 12px 0; }
  .nhan { font-size: 14px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
  .gia-tri { font-size: 26px; font-weight: 700; margin-top: 4px; line-height: 1.3; }
  .gia-tri.nho { font-size: 20px; }
  .link-map { color: #60a5fa; text-decoration: underline; }
  .ds-danh-ba { list-style: none; margin: 8px 0 0; padding: 0; }
  .ds-danh-ba li { font-size: 20px; font-weight: 600; padding: 8px 0; border-top: 1px solid #374151; }
  .luoi-anh { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-top: 12px; }
  .luoi-anh img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 12px; display: block; background: #222; }
  .chu-thich-anh { color: #9ca3af; margin-top: 8px; font-size: 18px; }
  .hang-tai { margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; }
  .nut-tai { background: #2563eb; color: #fff; border: 0; border-radius: 10px; padding: 12px 18px; font-size: 18px; font-weight: 700; cursor: pointer; }
  .nut-tai:hover { background: #1d4ed8; }
  .hop-xanh { background: #14532d; border: 1px solid #22c55e; border-radius: 14px; padding: 18px 20px; margin: 20px 0 0; font-size: 20px; line-height: 1.5; }
  .cau-hoi { background: #1e3a5f; border: 1px solid #3b82f6; border-radius: 14px; padding: 18px 20px; margin: 12px 0 0; font-size: 20px; line-height: 1.6; }
  .cau-hoi b { color: #fbbf24; }
  .trong { padding: 80px 20px; text-align: center; font-size: 24px; color: #9ca3af; line-height: 1.6; }
</style>
</head>
<body>
<div class="dau">
  <h1>App vừa biết được những gì?</h1>
  <div class="trang-thai" id="trangThai">Đang tải thông tin...</div>
</div>
<div class="khung">
  <div class="luoi-may" id="luoiMay" style="display:none"></div>
  <div class="hop-xanh" id="hopXanh" style="display:none">Đây là demo trên máy thầy — thầy tự cho phép. Camera, vị trí, ảnh và danh bạ ở trên đều là thật trên máy thầy và chỉ hiện trên máy này, không gửi đi đâu, không lưu lại — đóng trang là mất. Học sinh chơi ở chế độ riêng, hoàn toàn giả lập.</div>
  <div class="cau-hoi" id="cauHoi" style="display:none"><b>Nếu đây là app thật thì sao?</b> Thầy vừa tự tay cho phép hết trên máy của mình. Nếu một app lạ cũng xin như vậy trên máy học sinh — và các em cũng bấm Cho phép nhanh như thầy vừa bấm — thì người lạ sẽ có đúng những thứ này của các em. Cả lớp nghĩ sao?</div>
</div>
<div class="trong" id="thongBaoTrong" style="display:none">Chưa có thông tin.<br>Thầy bấm "Gửi toàn bộ thông tin lên laptop" trên điện thoại.</div>
<script>
  var khoaCuoi = null;

  function lay(id) { return document.getElementById(id); }

  // Chẩn đoán: hiện lỗi JavaScript lên trang để thấy nguyên nhân
  // (trước đây lỗi phía máy khách làm trang kẹt ở "Đang tải..." mà không báo gì).
  window.onerror = function(thongDiep, nguon, dong, cot) {
    var tt = lay('trangThai');
    if (tt) tt.textContent = 'Lỗi trang: ' + thongDiep + ' (dòng ' + dong + ')';
    return false;
  };
  function baoLoi(chu) {
    var tt = lay('trangThai');
    if (tt) tt.textContent = chu;
  }

  // Hỏi máy chủ xem dữ liệu có thay đổi không; có thì mới tải về (đỡ nặng).
  function kiemTraMoi() {
    try {
    google.script.run
      .withSuccessHandler(function(khoa) {
        if (khoa && khoa.indexOf('LOI:') === 0) {
          var tt = lay('trangThai');
          if (tt) tt.textContent = 'Không tải được thông tin: ' + khoa.slice(4);
          return;
        }
        if (khoa !== khoaCuoi) {
          khoaCuoi = khoa;
          taiThongTin();
        }
      })
      .withFailureHandler(function(loi) {
        var tt = lay('trangThai');
        if (tt) tt.textContent = 'Không tải được thông tin (lỗi máy chủ). Thầy mở Apps Script xem nhật ký lỗi, hoặc triển khai lại Code.gs mới.';
      })
      .layKhoaThongTin();
    } catch (loi) {
      baoLoi('Lỗi gọi máy chủ: ' + (loi && loi.message ? loi.message : String(loi)));
    }
  }

  function taiThongTin() {
    try {
    google.script.run
      .withSuccessHandler(hienThongTin)
      .withFailureHandler(function(loi) {
        var tt = lay('trangThai');
        if (tt) tt.textContent = 'Không tải được thông tin (lỗi máy chủ). Thầy mở Apps Script xem nhật ký lỗi, hoặc triển khai lại Code.gs mới.';
      })
      .layThongTinTatCaMay();
    } catch (loi) {
      baoLoi('Lỗi tải dữ liệu: ' + (loi && loi.message ? loi.message : String(loi)));
    }
  }

  // Vị trí dạng "lat, lng" thì link tới đúng tọa độ trên Google Maps;
  // vị trí là chữ tự do thì link tới tìm kiếm chuỗi đó trên Google Maps.
  // Nếu số đầu vượt quá 90 thì chắc chắn là kinh độ (vĩ độ tối đa 90),
  // tức app gửi theo thứ tự "lng, lat" — đảo lại thành "lat, lng".
  function taoLinkViTri(viTri) {
    var a = document.createElement('a');
    a.className = 'link-map';
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = viTri;
    var phan = viTri.split(',');
    var laToaDo = false;
    if (phan.length === 2) {
      var so1 = Number(phan[0].trim());
      var so2 = Number(phan[1].trim());
      if (phan[0].trim() !== '' && phan[1].trim() !== '' && !isNaN(so1) && !isNaN(so2)) {
        var lat = so1;
        var lng = so2;
        if (Math.abs(lat) > 90 && Math.abs(lng) <= 90) {
          lat = so2;
          lng = so1;
        }
        laToaDo = true;
        a.href = 'https://www.google.com/maps?q=' + lat + ',' + lng;
      }
    }
    if (!laToaDo) {
      a.href = 'https://www.google.com/maps?q=' + encodeURIComponent(viTri);
    }
    return a;
  }

  // Tải Album về: tải từng ảnh về máy (mỗi ảnh 1 file).
  // Trình duyệt có thể hỏi cho phép tải nhiều file — bấm Cho phép là được.
  function taiAnh(danhSachAnh) {
    for (var i = 0; i < danhSachAnh.length; i++) {
      (function(a, idx) {
        setTimeout(function() {
          var link = document.createElement('a');
          link.href = a.anh;
          link.download = a.ten || ('anh-' + (idx + 1) + '.jpg');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, idx * 600);
      })(danhSachAnh[i], i);
    }
  }

  // Tải Danh bạ về thành 1 file .txt.
  function taiDanhBa(m) {
    var dong = [];
    dong.push('Danh bạ — ' + m.may);
    if (m.ten) dong.push('Tên: ' + m.ten);
    if (m.soDienThoai) dong.push('Số điện thoại: ' + m.soDienThoai);
    dong.push('');
    for (var i = 0; i < m.danhBa.length; i++) {
      dong.push(m.danhBa[i].ten + (m.danhBa[i].so ? ' — ' + m.danhBa[i].so : ''));
    }
    var blob = new Blob([dong.join('\n')], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'danh-ba-may-' + m.may.replace(/\D/g, '') + '.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
  }

  function hangThongTin(nhan, chu) {
    var hang = document.createElement('div');
    hang.className = 'hang-thong-tin';
    var n = document.createElement('div');
    n.className = 'nhan';
    n.textContent = nhan;
    var g = document.createElement('div');
    g.className = 'gia-tri';
    g.textContent = chu && chu !== '' ? chu : 'Chưa nhập';
    hang.appendChild(n);
    hang.appendChild(g);
    return hang;
  }

  function theMay(m) {
    var the = document.createElement('div');
    the.className = 'the-may';
    var nhanMay = document.createElement('div');
    nhanMay.className = 'nhan-may';
    nhanMay.textContent = m.may;
    the.appendChild(nhanMay);
    var coDuLieu = (m.ten && m.ten !== '') || (m.soDienThoai && m.soDienThoai !== '') || (m.viTri && m.viTri !== '') || (m.danhBa && m.danhBa.length > 0) || (m.anh && m.anh.length > 0);
    if (!coDuLieu) {
      the.className = 'the-may trong';
      var chu = document.createElement('div');
      chu.className = 'gia-tri nho';
      chu.style.color = '#9ca3af';
      chu.textContent = m.may + ' — chưa có thông tin';
      the.appendChild(chu);
      return the;
    }
    the.appendChild(hangThongTin('Họ và tên', m.ten || ''));
    the.appendChild(hangThongTin('Số điện thoại', m.soDienThoai || ''));
    // Vị trí: hiện thành link bấm vào mở Google Maps.
    var hangViTri = document.createElement('div');
    hangViTri.className = 'hang-thong-tin';
    var nVt = document.createElement('div');
    nVt.className = 'nhan';
    nVt.textContent = 'Vị trí lúc này (bấm để mở Google Maps)';
    var gVt = document.createElement('div');
    gVt.className = 'gia-tri nho';
    if (m.viTri && m.viTri !== '') {
      gVt.appendChild(taoLinkViTri(m.viTri));
    } else {
      gVt.textContent = 'Chưa nhập';
    }
    hangViTri.appendChild(nVt);
    hangViTri.appendChild(gVt);
    the.appendChild(hangViTri);
    // Danh bạ.
    var hangDb = document.createElement('div');
    hangDb.className = 'hang-thong-tin';
    var nDb = document.createElement('div');
    nDb.className = 'nhan';
    nDb.textContent = 'Danh bạ app đã lấy';
    var ds = document.createElement('ul');
    ds.className = 'ds-danh-ba';
    if (!m.danhBa || m.danhBa.length === 0) {
      var li = document.createElement('li');
      li.textContent = 'Chưa chọn người nào';
      li.style.color = '#9ca3af';
      ds.appendChild(li);
    } else {
      for (var i = 0; i < m.danhBa.length; i++) {
        var li2 = document.createElement('li');
        li2.textContent = m.danhBa[i].ten + (m.danhBa[i].so ? ' — ' + m.danhBa[i].so : '');
        ds.appendChild(li2);
      }
    }
    hangDb.appendChild(nDb);
    hangDb.appendChild(ds);
    the.appendChild(hangDb);
    // Ảnh.
    if (m.anh && m.anh.length > 0) {
      var luoi = document.createElement('div');
      luoi.className = 'luoi-anh';
      for (var j = 0; j < m.anh.length; j++) {
        var img = document.createElement('img');
        img.src = m.anh[j].anh;
        img.alt = m.anh[j].ten;
        luoi.appendChild(img);
      }
      the.appendChild(luoi);
      var chuThich = document.createElement('div');
      chuThich.className = 'chu-thich-anh';
      chuThich.textContent = 'Ảnh app vừa lấy (' + m.anh.length + ' ảnh).';
      the.appendChild(chuThich);
    }
    // Nút tải về: Album (ảnh) và Danh bạ.
    var hangTai = document.createElement('div');
    hangTai.className = 'hang-tai';
    if (m.anh && m.anh.length > 0) {
      var nutAnh = document.createElement('button');
      nutAnh.className = 'nut-tai';
      nutAnh.textContent = 'Tải Album về (' + m.anh.length + ' ảnh)';
      nutAnh.onclick = (function(danhSachAnh) {
        return function() { taiAnh(danhSachAnh); };
      })(m.anh);
      hangTai.appendChild(nutAnh);
    }
    if (m.danhBa && m.danhBa.length > 0) {
      var nutDb = document.createElement('button');
      nutDb.className = 'nut-tai';
      nutDb.textContent = 'Tải Danh bạ về';
      nutDb.onclick = (function(may) {
        return function() { taiDanhBa(may); };
      })(m);
      hangTai.appendChild(nutDb);
    }
    if (hangTai.childNodes.length > 0) the.appendChild(hangTai);
    return the;
  }

  function hienThongTin(d) {
    var luoi = lay('luoiMay');
    var trong = lay('thongBaoTrong');
    var trangThai = lay('trangThai');
    var hopXanh = lay('hopXanh');
    var cauHoi = lay('cauHoi');
    if (d && d.loi) {
      trangThai.textContent = 'Không tải được thông tin: ' + d.loi;
      return;
    }
    var danhSach = (d && d.may) || [];
    var coMayNao = false;
    for (var i = 0; i < danhSach.length; i++) {
      var m = danhSach[i];
      if ((m.ten && m.ten !== '') || (m.soDienThoai && m.soDienThoai !== '') || (m.viTri && m.viTri !== '') || (m.danhBa && m.danhBa.length > 0) || (m.anh && m.anh.length > 0)) {
        coMayNao = true;
        break;
      }
    }
    if (!coMayNao) {
      luoi.style.display = 'none';
      hopXanh.style.display = 'none';
      cauHoi.style.display = 'none';
      trong.style.display = 'block';
      trangThai.textContent = 'Chưa có thông tin.';
      return;
    }
    trong.style.display = 'none';
    luoi.innerHTML = '';
    for (var j = 0; j < danhSach.length; j++) {
      luoi.appendChild(theMay(danhSach[j]));
    }
    luoi.style.display = 'grid';
    hopXanh.style.display = 'block';
    cauHoi.style.display = 'block';
    trangThai.textContent = 'Đang chiếu thông tin của các máy (tự làm mới mỗi 2 giây).';
  }

  // Khởi động: kiểm tra google.script.run có sẵn không rồi mới gọi.
  // Nếu API này không khả dụng thì trang sẽ báo rõ, thay vì kẹt ở "Đang tải...".
  (function() {
    try {
      if (typeof google === 'undefined' || !google.script || !google.script.run) {
        baoLoi('Lỗi: google.script.run không khả dụng trên trang này. Thầy tải lại trang (F5), hoặc mở link bằng trình duyệt khác.');
        return;
      }
      kiemTraMoi();
      setInterval(kiemTraMoi, 2000);
    } catch (loi) {
      baoLoi('Lỗi trang: ' + (loi && loi.message ? loi.message : String(loi)));
    }
  })();
</script>
</body>
</html>`;
