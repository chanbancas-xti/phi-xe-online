const usageSelect = document.getElementById("usage");
const vehicleTypeSelect = document.getElementById("vehicleType");
const vehicleValueInput = document.getElementById("vehicleValue");
const insuredValueInput = document.getElementById("insuredValue");
const calculateButton = document.getElementById("calculateButton");
const resultBox = document.getElementById("result");

let vehicleOptions = [];

async function loadVehicleOptions() {
  const response = await fetch("./data/vehicle-options.json");

  if (!response.ok) {
    throw new Error("Không đọc được file data/vehicle-options.json");
  }

  vehicleOptions = await response.json();
}

function renderVehicleOptions(usage) {
  vehicleTypeSelect.innerHTML = '<option value="">Chọn loại xe</option>';

  if (!usage) {
    vehicleTypeSelect.disabled = true;
    return;
  }

  const filteredOptions = vehicleOptions.filter((item) => {
    return item.active && item.usage === usage;
  });

  for (const item of filteredOptions) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label;
    vehicleTypeSelect.appendChild(option);
  }

  vehicleTypeSelect.disabled = false;
}

function formatNumber(value) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function validateForm() {
  const usage = usageSelect.value;
  const vehicleType = vehicleTypeSelect.value;
  const vehicleValue = Number(vehicleValueInput.value);
  const insuredValue = Number(insuredValueInput.value);

  if (!usage) {
    return "Bạn chưa chọn mục đích sử dụng.";
  }

  if (!vehicleType) {
    return "Bạn chưa chọn loại xe.";
  }

  if (!vehicleValue || vehicleValue <= 0) {
    return "Bạn chưa nhập giá trị xe hợp lệ.";
  }

  if (!insuredValue || insuredValue <= 0) {
    return "Bạn chưa nhập tiền bảo hiểm hợp lệ.";
  }

  return null;
}

function showSelectedInfo() {
  const errorMessage = validateForm();

  if (errorMessage) {
    resultBox.textContent = errorMessage;
    return;
  }

  const usage = usageSelect.value;
  const selectedVehicle = vehicleOptions.find((item) => item.id === vehicleTypeSelect.value);
  const vehicleValue = Number(vehicleValueInput.value);
  const insuredValue = Number(insuredValueInput.value);

  resultBox.innerHTML = `
    <div>Mục đích sử dụng: <strong>${usage}</strong></div>
    <div>Loại xe: <strong>${selectedVehicle ? selectedVehicle.label : ""}</strong></div>
    <div>Giá trị xe: <strong>${formatNumber(vehicleValue)}</strong></div>
    <div>Tiền bảo hiểm: <strong>${formatNumber(insuredValue)}</strong></div>
    <div style="margin-top: 10px;">Bước tiếp theo: nối dropdown này với bảng tỉ lệ phí VCX để tính phí.</div>
  `;
}

async function init() {
  await loadVehicleOptions();

  usageSelect.addEventListener("change", (event) => {
    renderVehicleOptions(event.target.value);
    resultBox.textContent = "Đã cập nhật danh sách loại xe.";
  });

  calculateButton.addEventListener("click", () => {
    showSelectedInfo();
  });
}

init().catch((error) => {
  console.error(error);
  resultBox.textContent = error.message;
});
