export default function showToast(
  message = "sample message",
  toastType = "info"
) {
  let box = document.createElement("div");
  box.classList.add("toast", `toast-${toastType}`);
  box.innerHTML = ` <div class="toast-content-wrapper">
                    <div class="toast-message">${message}</div>
                    </div>`;
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 2500);
}
