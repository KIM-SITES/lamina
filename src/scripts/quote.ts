import { services } from "../data/content";

export function initQuote() {
  const form = document.querySelector<HTMLFormElement>("[data-quote-form]");
  if (!form) return;
  form.querySelectorAll("fieldset").forEach((fieldset) => {
    fieldset.disabled = false;
  });
  form.querySelector<HTMLElement>("[data-quote-noscript]")!.hidden = true;
  form.querySelector<HTMLButtonElement>("[data-quote-submit]")!.hidden = false;
  const result = form.querySelector<HTMLElement>("[data-quote-result]")!;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const service = services.find((item) => item.id === data.get("servico"));
    const property = String(data.get("imovel") || "");
    if (!service || !property) return;
    const title = document.createElement("strong");
    title.textContent = "Sua possibilidade, em resumo";
    const selection = document.createElement("span");
    selection.textContent = `${service.title} para ${property.toLocaleLowerCase("pt-BR")}.`;
    const notice = document.createElement("p");
    notice.textContent =
      "Simulação demonstrativa. Nenhuma solicitação foi enviada.";
    result.replaceChildren(title, selection, notice);
  });
  form.addEventListener("change", () => result.replaceChildren());
  document
    .querySelectorAll<HTMLAnchorElement>("[data-select-service]")
    .forEach((link) =>
      link.addEventListener("click", () => {
        const input = form.querySelector<HTMLInputElement>(
          `input[value="${link.dataset.selectService}"]`,
        );
        if (input) {
          input.checked = true;
          result.replaceChildren();
        }
      }),
    );
}
