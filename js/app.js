/* =====================================================
   مظلة الشمس — Landing Page (سكريبت بسيط)
   ===================================================== */

/* ---------- الإعدادات ---------- */
const WHATSAPP_NUMBER = "213555123456"; // رقمك بالصيغة الدولية بدون +
const PRICE = 1500; // سعر المظلة (دج)
const SHIP_OFFICE = 600; // التوصيل إلى مكتب البريد
const SHIP_HOME = 900; // التوصيل إلى المنزل
const CURRENCY = "دج";

/* ---------- أدوات ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const fmt = (n) => n.toLocaleString("fr-DZ").replace(/\u00a0/g, " ") + " " + CURRENCY;

const currentDelivery = () => {
  const el = $('input[name="delivery"]:checked');
  return el ? el.value : "office";
};

/* ---------- الولايات ---------- */
function fillWilayas() {
  const sel = $("#wilaya");
  if (!sel) return;
  sel.innerHTML =
    '<option value="">-- اختر الولاية --</option>' +
    WILAYAS.map((w) => `<option value="${w.ar}">${w.ar} (${w.code})</option>`).join("");
}

/* ---------- المجموع المباشر ---------- */
function updateTotal() {
  const qty = +$("#qty").value || 1;
  const home = currentDelivery() === "home";
  const ship = home ? SHIP_HOME : SHIP_OFFICE;
  $("#sumItems").textContent = `${qty} × ${fmt(PRICE)}`;
  $("#sumShipLabel").textContent = home ? "الشحن (المنزل)" : "الشحن (مكتب البريد)";
  $("#sumShip").textContent = fmt(ship);
  $("#totalPrice").textContent = fmt(PRICE * qty + ship);
}

/* ---------- إرسال الطلب عبر واتساب ---------- */
function buildMessage(data) {
  const ship = data.delivery === "home" ? SHIP_HOME : SHIP_OFFICE;
  const items = PRICE * data.qty;
  const lines = [
    "طلب جديد — مظلة شمسية للسيارات",
    "==============================",
    `الكمية: ${data.qty} × ${fmt(PRICE)} = ${fmt(items)}`,
    `الشحن (${data.delivery === "home" ? "المنزل" : "مكتب البريد"}): ${fmt(ship)}`,
    `المجموع الكلي: ${fmt(items + ship)}`,
    "==============================",
    `الاسم: ${data.fullName}`,
    `الهاتف: ${data.phone}`,
    `الولاية: ${data.wilaya}`,
    `العنوان: ${data.address}`,
    `طريقة الدفع: نقدًا عند الاستلام`
  ];
  return lines.join("\n");
}

function submitOrder(e) {
  e.preventDefault();
  const form = e.target;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = {
    fullName: $("#fullName").value.trim(),
    phone: $("#phone").value.trim(),
    wilaya: $("#wilaya").value,
    address: $("#address").value.trim(),
    delivery: currentDelivery(),
    qty: +$("#qty").value || 1
  };

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(data))}`;
  window.open(url, "_blank");
  showToast("تم تجهيز طلبك، سيُفتح واتساب لإرساله");
  form.reset();
  updateTotal();
}

/* ---------- توست ---------- */
let toastTimer;
function showToast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("toast--show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("toast--show"), 4000);
}

/* ---------- التهيئة والأحداث ---------- */
document.addEventListener("DOMContentLoaded", () => {
  fillWilayas();
  if ($("#qty")) { $("#qty").value = "1"; updateTotal(); }

  $$('input[name="delivery"]').forEach((r) => r.addEventListener("change", updateTotal));
  $("#qty").addEventListener("change", updateTotal);

  $("#orderForm").addEventListener("submit", submitOrder);

  $("#navToggle").addEventListener("click", () => $("#nav").classList.toggle("nav--open"));

  // ظل على الترويسة عند التمرير
  const header = $("#header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("header--scrolled", window.scrollY > 10);
  });

  $("#year").textContent = new Date().getFullYear();
});