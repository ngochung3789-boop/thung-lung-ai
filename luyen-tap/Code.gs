// ============================================================================
//  ĐƯỜNG CHUYỂN TOÀN BỘ THÔNG TIN: ĐIỆN THOẠI (thầy) -> LAPTOP (thầy) -> CHIẾU LÊN TV
//  Chỉ phục vụ thầy Phạm Ngọc Hưng và dữ liệu CỦA THẦY.
//  - Hỗ trợ NHIỀU MÁY gửi cùng lúc (Máy 1..Máy 5, có thể tới Máy 6):
//    mỗi máy lưu riêng, gửi mới chỉ thay dữ liệu của đúng máy đó.
//  - Trang gửi: thầy chọn số máy của mình trước khi gửi.
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
  var meta = {
    may: 'Máy ' + soMay,
    ten: sachChuoi(thongTin.ten),
    soDienThoai: sachChuoi(thongTin.soDienThoai),
    viTri: sachChuoi(thongTin.viTri),
    danhBa: sachDanhBa(thongTin.danhBa),
    anh: tenAnh
  };
  var blobJson = Utilities.newBlob(JSON.stringify(meta), 'application/json', tenFileThongTinMay(soMay));
  thuMuc.createFile(blobJson);
  return { soMay: soMay, soAnh: dem };
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
// Trả về {soMay, soAnh}.
function luuThongTin(thongTin) {
  return luuThongTinVaoDrive(thongTin || {});
}

// Trang gửi ảnh (bản cũ) gọi hàm này để chỉ lưu ảnh.
// dauVao là mảng ảnh (mặc định Máy 1) hoặc {may, anh}.
function luuAnh(dauVao) {
  if (dauVao && dauVao.anh) return luuAnhVaoDrive(dauVao.anh, dauVao.may);
  return luuAnhVaoDrive(dauVao || [], 1);
}

// Đọc file thong-tin-may-N.json; không có thì trả về thông tin trống.
function docThongTinMay(thuMuc, soMay) {
  var trong = { may: 'Máy ' + soMay, ten: '', soDienThoai: '', viTri: '', danhBa: [], anh: [] };
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
      anh: goi.anh || []
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
    var coDuLieu = (meta.ten !== '') || (meta.soDienThoai !== '') || (meta.viTri !== '') || (meta.danhBa.length > 0) || (meta.anh.length > 0) || (anhMay.length > 0);
    if (!coDuLieu) continue;
    daCo[n] = true;
    ketQua.push({
      may: 'Máy ' + n,
      ten: meta.ten,
      soDienThoai: meta.soDienThoai,
      viTri: meta.viTri,
      danhBa: meta.danhBa,
      anh: anhMay
    });
  }
  // Các máy 1..SO_MAY_HIEN chưa gửi: thêm ô trống để thầy thấy còn thiếu máy nào.
  for (var m = 1; m <= SO_MAY_HIEN; m++) {
    if (daCo[m]) continue;
    ketQua.push({ may: 'Máy ' + m, ten: '', soDienThoai: '', viTri: '', danhBa: [], anh: [] });
  }
  ketQua.sort(function(a, b) {
    return parseInt(a.may.replace(/\D/g, ''), 10) - parseInt(b.may.replace(/\D/g, ''), 10);
  });
  return { may: ketQua };
  } catch (loi) {
    return { may: [], loi: (loi && loi.message ? loi.message : String(loi)) };
  }
}

// Trả về dữ liệu của Máy 1 (định dạng cũ) — giữ lại cho tương thích ngược.
function layThongTin() {
  var tatCa = layThongTinTatCaMay().may;
  for (var i = 0; i < tatCa.length; i++) {
    if (tatCa[i].may === 'Máy 1') return tatCa[i];
  }
  return { may: 'Máy 1', ten: '', soDienThoai: '', viTri: '', danhBa: [], anh: [] };
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
//    "anh":[{"ten":"...","duLieu":"..."}]}
// "may" chấp nhận 1-6, "1"-"6", "Máy 1"-"Máy 6" (mặc định Máy 1).
// Tương thích ngược:
//   - không có "may" thì mặc định Máy 1
//   - chỉ có {"anh":[...]} vẫn chạy (tên/số/vị trí/danh bạ để trống)
//   - một ảnh {"ten":"...","duLieu":"..."} (ten là tên file ảnh)
//   - form: may, ten0/anh0, ten1/anh1... (+ soDienThoai, viTri, danhBa dạng JSON nếu có)
// Trả về JSON {"thanhCong":true,"may":"Máy N","soAnh":N}.
function doPost(e) {
  try {
    var thongTin = { may: 1, ten: '', soDienThoai: '', viTri: '', danhBa: [], anh: [] };
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
          }
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
      try {
        thongTin.danhBa = e.parameter.danhBa ? JSON.parse(e.parameter.danhBa) : [];
      } catch (loiDanhBa) {
        thongTin.danhBa = [];
      }
    }
    var ketQua = luuThongTinVaoDrive(thongTin);
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
//  cần JavaScript. Trang tự tải lại mỗi 3 giây (meta refresh) để nhận máy mới gửi.
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

function theMayMayChu(m) {
  var coDuLieu = (m.ten && m.ten !== '') || (m.soDienThoai && m.soDienThoai !== '') ||
    (m.viTri && m.viTri !== '') || (m.danhBa && m.danhBa.length > 0) || (m.anh && m.anh.length > 0);
  var h = '<div class="the-may' + (coDuLieu ? '' : ' trong') + '">';
  h += '<div class="nhan-may">' + escHtml(m.may) + '</div>';
  if (!coDuLieu) {
    h += '<div class="gia-tri nho" style="color:#9ca3af">' + escHtml(m.may) + ' — chưa có thông tin</div>';
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
  if (m.anh && m.anh.length > 0) {
    h += '<div class="luoi-anh">';
    for (var j = 0; j < m.anh.length; j++) {
      h += '<a href="' + m.anh[j].anh + '" download="' + escHtml(m.anh[j].ten || ('anh-' + (j + 1) + '.jpg')) + '" title="Bấm để tải ảnh này về"><img src="' + m.anh[j].anh + '" alt="' + escHtml(m.anh[j].ten || '') + '"></a>';
    }
    h += '</div>';
    h += '<div class="chu-thich-anh">Ảnh app vừa lấy (' + m.anh.length + ' ảnh). Bấm vào từng ảnh để tải ảnh đó về máy.</div>';
  }
  var nut = '';
  if (m.anh && m.anh.length > 0) {
    for (var k = 0; k < m.anh.length; k++) {
      nut += '<a class="nut-tai" href="' + m.anh[k].anh + '" download="' + escHtml(m.anh[k].ten || ('anh-' + (k + 1) + '.jpg')) + '">Tải ảnh ' + (k + 1) + ' về</a>';
    }
  }
  if (m.danhBa && m.danhBa.length > 0) {
    var b64 = Utilities.base64Encode(Utilities.newBlob(chuoiDanhBaTxt(m), 'text/plain', 'danh-ba.txt').getBytes());
    nut += '<a class="nut-tai" href="data:text/plain;charset=utf-8;base64,' + b64 + '" download="danh-ba-may-' + m.may.replace(/\D/g, '') + '.txt">Tải Danh bạ về</a>';
  }
  if (nut !== '') h += '<div class="hang-tai">' + nut + '</div>';
  h += '</div>';
  return h;
}

// Vẽ toàn bộ trang trình chiếu phía máy chủ (đã có dữ liệu, không cần gọi lại).
function taoTrangTrinhChieu() {
  var d = layThongTinTatCaMay();
  var danhSach = (d && d.may) || [];
  var coMayNao = false;
  for (var i = 0; i < danhSach.length; i++) {
    var m = danhSach[i];
    if ((m.ten && m.ten !== '') || (m.soDienThoai && m.soDienThoai !== '') || (m.viTri && m.viTri !== '') || (m.danhBa && m.danhBa.length > 0) || (m.anh && m.anh.length > 0)) { coMayNao = true; break; }
  }
  var trangThai, luoiHtml, hopXanh, cauHoi, trong;
  if (d && d.loi) {
    trangThai = 'Không tải được thông tin: ' + d.loi;
    luoiHtml = ''; hopXanh = ''; cauHoi = '';
    trong = '<div class="trong">Không tải được thông tin.<br>' + escHtml(d.loi) + '</div>';
  } else if (!coMayNao) {
    trangThai = 'Chưa có thông tin.';
    luoiHtml = ''; hopXanh = ''; cauHoi = '';
    trong = '<div class="trong">Chưa có thông tin.<br>Thầy bấm "Đăng ký" trên điện thoại.</div>';
  } else {
    trangThai = 'Đang chiếu thông tin của các máy (tự làm mới mỗi 3 giây).';
    var the = '';
    for (var j = 0; j < danhSach.length; j++) the += theMayMayChu(danhSach[j]);
    luoiHtml = '<div class="luoi-may">' + the + '</div>';
    hopXanh = '<div class="hop-xanh">Đây là demo trên máy thầy — thầy tự cho phép. Camera, vị trí, ảnh và danh bạ ở trên đều là thật trên máy thầy và chỉ hiện trên máy này, không gửi đi đâu, không lưu lại — đóng trang là mất. Học sinh chơi ở chế độ riêng, hoàn toàn giả lập.</div>';
    cauHoi = '<div class="cau-hoi"><b>Nếu đây là app thật thì sao?</b> Thầy vừa tự tay cho phép hết trên máy của mình. Nếu một app lạ cũng xin như vậy trên máy học sinh — và các em cũng bấm Cho phép nhanh như thầy vừa bấm — thì người lạ sẽ có đúng những thứ này của các em. Cả lớp nghĩ sao?</div>';
    trong = '';
  }
  return '<!DOCTYPE html>\n<html lang="vi">\n<head>\n<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<meta http-equiv="refresh" content="3">\n' +
    '<title>Trình chiếu thông tin Avatar AI</title>\n<style>\n' +
    '  * { box-sizing: border-box; }\n' +
    '  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #111; color: #f3f4f6; }\n' +
    '  .dau { padding: 20px 24px 8px; }\n' +
    '  h1 { font-size: 30px; margin: 0 0 4px; }\n' +
    '  .trang-thai { font-size: 15px; color: #9ca3af; }\n' +
    '  .khung { padding: 12px 24px 24px; }\n' +
    '  .luoi-may { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px; align-items: start; }\n' +
    '  .the-may { background: #1f2937; border: 1px solid #374151; border-radius: 14px; padding: 18px 20px; }\n' +
    '  .the-may.trong { opacity: 0.55; }\n' +
    '  .nhan-may { font-size: 28px; font-weight: 800; color: #fbbf24; margin-bottom: 10px; }\n' +
    '  .the-may.trong .nhan-may { color: #9ca3af; }\n' +
    '  .hang-thong-tin { margin: 12px 0; }\n' +
    '  .nhan { font-size: 14px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }\n' +
    '  .gia-tri { font-size: 26px; font-weight: 700; margin-top: 4px; line-height: 1.3; }\n' +
    '  .gia-tri.nho { font-size: 20px; }\n' +
    '  .link-map { color: #60a5fa; text-decoration: underline; }\n' +
    '  .ds-danh-ba { list-style: none; margin: 8px 0 0; padding: 0; }\n' +
    '  .ds-danh-ba li { font-size: 20px; font-weight: 600; padding: 8px 0; border-top: 1px solid #374151; }\n' +
    '  .luoi-anh { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-top: 12px; }\n' +
    '  .luoi-anh img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 12px; display: block; background: #222; }\n' +
    '  .chu-thich-anh { color: #9ca3af; margin-top: 8px; font-size: 18px; }\n' +
    '  .hang-tai { margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; }\n' +
    '  .nut-tai { background: #2563eb; color: #fff; border: 0; border-radius: 10px; padding: 12px 18px; font-size: 18px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-block; }\n' +
    '  .nut-tai:hover { background: #1d4ed8; }\n' +
    '  .hop-xanh { background: #14532d; border: 1px solid #22c55e; border-radius: 14px; padding: 18px 20px; margin: 20px 0 0; font-size: 20px; line-height: 1.5; }\n' +
    '  .cau-hoi { background: #1e3a5f; border: 1px solid #3b82f6; border-radius: 14px; padding: 18px 20px; margin: 12px 0 0; font-size: 20px; line-height: 1.6; }\n' +
    '  .cau-hoi b { color: #fbbf24; }\n' +
    '  .trong { padding: 80px 20px; text-align: center; font-size: 24px; color: #9ca3af; line-height: 1.6; }\n' +
    '</style>\n</head>\n<body>\n' +
    '<div class="dau"><h1>App vừa biết được những gì?</h1><div class="trang-thai">' + escHtml(trangThai) + '</div></div>\n' +
    '<div class="khung">' + luoiHtml + hopXanh + cauHoi + '</div>\n' + trong +
    '\n</body>\n</html>';
}

function doGet(e) {
  var page = (e && e.parameter && e.parameter.page) || '';
  if (page === 'gui') {
    return HtmlService.createHtmlOutput(TRANG_GUI_ANH)
      .setTitle('Gửi thông tin lên laptop')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  // Trang trình chiếu vẽ sẵn phía máy chủ (không dùng google.script.run nữa).
  // Bản TRANG_TRINH_CHIEU cũ bên dưới không còn được phục vụ.
  return HtmlService.createHtmlOutput(taoTrangTrinhChieu())
    .setTitle('Trình chiếu thông tin Avatar AI')
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
