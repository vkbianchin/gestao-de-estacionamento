/* Tela: login (senha e, quando ativada, verificação em duas etapas) */
(() => {
  "use strict";
  const P = window.ParkFlow;
  const { api, fd, trocarPagina } = P;
  const $ = P.$;

  async function login(){
    const form = $("#login-form");
    let etapa = "senha";
    form?.addEventListener("submit", async e => {
      e.preventDefault();
      const erro = $("#login-error"), botao = form.querySelector('[type="submit"]');
      erro.textContent = "";
      botao.disabled = true;
      try {
        const r = await api(etapa === "senha" ? "/api/login" : "/api/login/2fa", { method: "POST", body: JSON.stringify(fd(form)) });
        if (r.exige_2fa) { etapa = "codigo"; pedirCodigo(form, botao); return; }
        trocarPagina(r.proxima || "/");
      } catch (ex) {
        erro.textContent = ex.message;
      } finally {
        botao.disabled = false;
      }
    });
    const senha = $("#login-password");
    senha?.addEventListener("keyup", e => { $("#caps-warning").hidden = !e.getModifierState("CapsLock"); });
  }

  function pedirCodigo(form, botao) {
    // Senha correta: esconde login e senha e pede o código de 6 dígitos do aplicativo autenticador.
    [...form.querySelectorAll("label")].filter(l => l.id !== "campo-codigo").forEach(l => { l.hidden = true; });
    form.elements.login.required = false;
    form.elements.senha.required = false;
    const campo = $("#campo-codigo");
    campo.hidden = false;
    form.elements.codigo.required = true;
    form.elements.codigo.focus();
    botao.firstChild.textContent = "Verificar código ";
  }

  P.telas.login = login;
})();
