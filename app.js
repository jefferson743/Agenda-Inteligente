const STORAGE_KEY = "agenda-inteligente-v1";

const defaultProfessionals = [
  {
    id: "caroline",
    name: "Dra. Caroline",
    short: "Caroline",
    days: [1, 4],
    color: "caroline",
    fixed: true,
    visible: true,
  },
  {
    id: "patricia",
    name: "Dra. Patrícia",
    short: "Patrícia",
    days: [3],
    color: "patricia",
    fixed: true,
    visible: true,
  },
];

const weekdayNames = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const $ = (selector) => document.querySelector(selector);

const els = {
  appShell: $("#appShell"),
  professionalReport: $("#professionalReport"),
  pageTitle: $("#pageTitle"),
  todayLabel: $("#todayLabel"),
  tomorrowLabel: $("#tomorrowLabel"),
  afterTomorrowLabel: $("#afterTomorrowLabel"),
  legendCard: $("#legendCard"),
  monthPicker: $("#monthPicker"),
  prevMonth: $("#prevMonth"),
  nextMonth: $("#nextMonth"),
  calendarHead: $("#calendarHead"),
  calendarBody: $("#calendarBody"),
  metricGrid: $("#metricGrid"),
  leadsTotal: $("#leadsTotal"),
  notesInput: $("#notesInput"),
  notifyButton: $("#notifyButton"),
  exportButton: $("#exportButton"),
  importInput: $("#importInput"),
  settingsButton: $("#settingsButton"),
  newAppointmentButton: $("#newAppointmentButton"),
  newClientButton: $("#newClientButton"),
  newProfessionalButton: $("#newProfessionalButton"),
  appointmentDialog: $("#appointmentDialog"),
  appointmentForm: $("#appointmentForm"),
  appointmentDialogTitle: $("#appointmentDialogTitle"),
  appointmentId: $("#appointmentId"),
  appointmentClient: $("#appointmentClient"),
  appointmentDate: $("#appointmentDate"),
  appointmentTime: $("#appointmentTime"),
  appointmentDoctor: $("#appointmentDoctor"),
  appointmentReminder: $("#appointmentReminder"),
  appointmentNotes: $("#appointmentNotes"),
  deleteAppointmentButton: $("#deleteAppointmentButton"),
  professionalDialog: $("#professionalDialog"),
  professionalForm: $("#professionalForm"),
  professionalDialogTitle: $("#professionalDialogTitle"),
  professionalId: $("#professionalId"),
  professionalName: $("#professionalName"),
  professionalVisible: $("#professionalVisible"),
  deleteProfessionalButton: $("#deleteProfessionalButton"),
  clientDialog: $("#clientDialog"),
  clientForm: $("#clientForm"),
  clientId: $("#clientId"),
  clientName: $("#clientName"),
  clientPhone: $("#clientPhone"),
  clientSource: $("#clientSource"),
  clientNotes: $("#clientNotes"),
  deleteClientButton: $("#deleteClientButton"),
  settingsDialog: $("#settingsDialog"),
  settingsForm: $("#settingsForm"),
  soundAlerts: $("#soundAlerts"),
  visualAlerts: $("#visualAlerts"),
  browserAlerts: $("#browserAlerts"),
  defaultReminder: $("#defaultReminder"),
  testAlertButton: $("#testAlertButton"),
  clientSearch: $("#clientSearch"),
  clientList: $("#clientList"),
  clientCount: $("#clientCount"),
  professionalList: $("#professionalList"),
  professionalCount: $("#professionalCount"),
  reportTitle: $("#reportTitle"),
  reportMetricGrid: $("#reportMetricGrid"),
  lastAppointmentsList: $("#lastAppointmentsList"),
  professionalInsights: $("#professionalInsights"),
  backToAgendaButton: $("#backToAgendaButton"),
  editReportProfessionalButton: $("#editReportProfessionalButton"),
  printReportButton: $("#printReportButton"),
  toast: $("#toast"),
};

let state = loadState();
state = normalizeState(state);
let selectedMonth = state.selectedMonth || monthKeyFromDate(new Date());
let reportProfessionalId = new URLSearchParams(window.location.search).get("professional");
const notifiedIds = new Set();

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function localDate(year, monthIndex, day) {
  return new Date(year, monthIndex, day, 12, 0, 0, 0);
}

function parseDateKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return localDate(year, month - 1, day);
}

function formatDate(date) {
  return date.toLocaleDateString("pt-BR");
}

function formatDateKey(key) {
  return formatDate(parseDateKey(key));
}

function monthKeyFromDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    selectedMonth: "2025-06",
    alertSettings: {
      sound: true,
      visual: true,
      browser: true,
      defaultReminder: 30,
    },
    professionals: defaultProfessionals,
    clients: [
      { id: "client-ana", name: "Ana Clara", phone: "", source: "Instagram", notes: "" },
      { id: "client-beatriz", name: "Beatriz", phone: "", source: "Indicação", notes: "" },
      { id: "client-carla", name: "Carla", phone: "", source: "WhatsApp", notes: "" },
      { id: "client-juliana", name: "Juliana", phone: "", source: "Instagram", notes: "" },
      { id: "client-mariana", name: "Mariana", phone: "", source: "Site", notes: "" },
      { id: "client-lucas", name: "Lucas", phone: "", source: "Indicação", notes: "" },
      { id: "client-fernanda", name: "Fernanda", phone: "", source: "WhatsApp", notes: "" },
      { id: "client-paulo", name: "Paulo", phone: "", source: "Site", notes: "" },
      { id: "client-renata", name: "Renata", phone: "", source: "Instagram", notes: "" },
      { id: "client-novo", name: "Novo Lead", phone: "", source: "Campanha", notes: "" },
    ],
    appointments: [
      seedAppointment("2025-06-02", "10:00", "caroline", "client-ana"),
      seedAppointment("2025-06-04", "14:00", "patricia", "client-beatriz"),
      seedAppointment("2025-06-05", "09:00", "caroline", "client-carla"),
      seedAppointment("2025-06-05", "16:00", "caroline", "client-juliana"),
      seedAppointment("2025-06-09", "11:00", "caroline", "client-mariana"),
      seedAppointment("2025-06-11", "10:00", "patricia", "client-lucas"),
      seedAppointment("2025-06-11", "15:00", "patricia", "client-fernanda"),
      seedAppointment("2025-06-12", "09:00", "caroline", "client-paulo"),
      seedAppointment("2025-06-16", "13:00", "caroline", "client-renata"),
      seedAppointment("2025-06-18", "10:00", "patricia", "client-novo"),
      seedAppointment("2025-06-19", "16:00", "caroline", "client-novo"),
    ],
    leads: {
      "2025-06-01": 0,
      "2025-06-02": 2,
      "2025-06-03": 1,
      "2025-06-04": 1,
      "2025-06-05": 3,
      "2025-06-09": 1,
      "2025-06-11": 2,
      "2025-06-12": 2,
      "2025-06-16": 1,
      "2025-06-17": 3,
    },
    notesByMonth: {
      "2025-06": "",
    },
  };
}

function seedAppointment(date, time, doctor, clientId) {
  return {
    id: makeId("appt"),
    date,
    time,
    doctor,
    clientId,
    reminderMinutes: 30,
    notes: "",
    done: false,
  };
}

function saveState() {
  state.selectedMonth = selectedMonth;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeState(rawState) {
  const professionals = Array.isArray(rawState.professionals) ? rawState.professionals : [];
  const mergedProfessionals = defaultProfessionals.map((professional) => ({
    ...professional,
    ...(professionals.find((item) => item.id === professional.id) || {}),
    fixed: true,
    visible: true,
  }));

  professionals
    .filter((professional) => !mergedProfessionals.some((item) => item.id === professional.id))
    .forEach((professional, index) => {
      mergedProfessionals.push({
        id: professional.id,
        name: professional.name || "Profissional",
        short: professional.short || professional.name || "Profissional",
        days: Array.isArray(professional.days) ? professional.days.map(Number) : [],
        color: professional.color || getExtraColor(index),
        fixed: false,
        visible: Boolean(professional.visible),
      });
    });

  return {
    selectedMonth: rawState.selectedMonth || "2025-06",
    alertSettings: {
      sound: rawState.alertSettings?.sound !== false,
      visual: rawState.alertSettings?.visual !== false,
      browser: rawState.alertSettings?.browser !== false,
      defaultReminder: Number(rawState.alertSettings?.defaultReminder || 30),
    },
    professionals: mergedProfessionals,
    clients: Array.isArray(rawState.clients) ? rawState.clients : [],
    appointments: Array.isArray(rawState.appointments) ? rawState.appointments : [],
    leads: rawState.leads || {},
    notesByMonth: rawState.notesByMonth || {},
  };
}

function getExtraColor(index) {
  const colors = ["extra-a", "extra-b", "extra-c", "extra-d"];
  return colors[index % colors.length];
}

function getClient(clientId) {
  return state.clients.find((client) => client.id === clientId);
}

function getProfessional(professionalId) {
  return state.professionals.find((professional) => professional.id === professionalId);
}

function getMonthDays(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const total = new Date(year, month, 0).getDate();
  return Array.from({ length: total }, (_, index) => localDate(year, month - 1, index + 1));
}

function setMonth(monthKey) {
  selectedMonth = monthKey;
  els.monthPicker.value = selectedMonth;
  saveState();
  render();
}

function render() {
  if (reportProfessionalId) {
    renderProfessionalReport(reportProfessionalId);
    return;
  }

  const [year, month] = selectedMonth.split("-").map(Number);
  els.pageTitle.textContent = `Agenda Inteligente - ${monthNames[month - 1]}/${year}`;
  renderTopDates();
  renderLegend();
  renderCalendarHead();
  renderCalendar();
  renderSummary();
  renderClients();
  renderProfessionals();
  renderAppointmentClientOptions();
  renderAppointmentProfessionalOptions();
  els.notesInput.value = state.notesByMonth[selectedMonth] || "";
}

function renderTopDates() {
  const today = new Date();
  const items = [
    [els.todayLabel, today, "HOJE"],
    [els.tomorrowLabel, addDays(today, 1), "AMANHÃ"],
    [els.afterTomorrowLabel, addDays(today, 2), "DEPOIS DE AMANHÃ"],
  ];

  items.forEach(([element, date]) => {
    element.textContent = `${formatDate(date)} (${weekdayNames[date.getDay()].toLowerCase()})`;
  });
}

function getVisibleProfessionals() {
  const monthProfessionalIds = new Set(
    state.appointments
      .filter((appointment) => appointment.date.startsWith(selectedMonth))
      .map((appointment) => appointment.doctor),
  );

  return state.professionals.filter(
    (professional) => professional.fixed || professional.visible || monthProfessionalIds.has(professional.id),
  );
}

function describeDays(days) {
  if (!days || days.length === 0) return "atendimento conforme agendamento";
  return days
    .slice()
    .sort((a, b) => a - b)
    .map((day) => weekdayNames[day].toLowerCase())
    .join(", ");
}

function renderLegend() {
  const professionalItems = getVisibleProfessionals()
    .map(
      (professional) =>
        `<div class="legend-professional" data-report-professional="${professional.id}" title="Clique duas vezes para abrir relatório"><span class="dot ${professional.color}"></span><strong>${professional.name}</strong> - ${describeDays(professional.days)}</div>`,
    )
    .join("");

  els.legendCard.innerHTML = `${professionalItems}<div><span class="dot none"></span>Não há atendimento</div>`;
}

function renderCalendarHead() {
  els.calendarHead.innerHTML = `
    <th>Data</th>
    <th>Dia da semana</th>
    <th>Leads captados</th>
    ${getVisibleProfessionals()
      .map(
        (professional) =>
          `<th class="doctor-head ${professional.color}" data-report-professional="${professional.id}" title="Clique duas vezes para abrir relatório">${professional.name}<br />(${describeDays(professional.days)})</th>`,
      )
      .join("")}
  `;
}

function openProfessionalReport(professionalId) {
  const url = new URL(window.location.href);
  url.searchParams.set("professional", professionalId);
  window.open(url.toString(), "_blank", "noopener");
}

function renderProfessionalReport(professionalId) {
  const professional = getProfessional(professionalId);
  if (!professional) {
    reportProfessionalId = "";
    window.history.replaceState({}, "", window.location.pathname);
    render();
    showToast("Profissional não encontrado.");
    return;
  }

  els.appShell.hidden = true;
  els.professionalReport.hidden = false;
  document.title = `Relatório - ${professional.name}`;
  els.reportTitle.textContent = professional.name;

  const now = new Date();
  const appointments = state.appointments
    .filter((appointment) => appointment.doctor === professionalId)
    .sort((a, b) => new Date(`${b.date}T${b.time}:00`) - new Date(`${a.date}T${a.time}:00`));
  const monthAppointments = appointments.filter((appointment) => appointment.date.startsWith(selectedMonth));
  const futureAppointments = appointments.filter((appointment) => new Date(`${appointment.date}T${appointment.time}:00`) >= now);
  const pastAppointments = appointments.filter((appointment) => new Date(`${appointment.date}T${appointment.time}:00`) < now);
  const uniqueClients = new Set(appointments.map((appointment) => appointment.clientId)).size;
  const nextAppointment = futureAppointments.slice().sort((a, b) => new Date(`${a.date}T${a.time}:00`) - new Date(`${b.date}T${b.time}:00`))[0];

  els.reportMetricGrid.innerHTML = `
    ${renderReportMetric("Total geral", appointments.length)}
    ${renderReportMetric(`No mês ${selectedMonth}`, monthAppointments.length)}
    ${renderReportMetric("Próximos", futureAppointments.length)}
    ${renderReportMetric("Já passaram", pastAppointments.length)}
    ${renderReportMetric("Clientes únicos", uniqueClients)}
    ${renderReportMetric("Próximo horário", nextAppointment ? `${formatDateKey(nextAppointment.date)} ${nextAppointment.time}` : "-")}
  `;

  els.lastAppointmentsList.innerHTML = appointments.length
    ? appointments
        .slice(0, 20)
        .map((appointment) => {
          const client = getClient(appointment.clientId);
          return `
            <button class="report-item" type="button" data-edit-appointment="${appointment.id}">
              <strong>${formatDateKey(appointment.date)} às ${appointment.time}</strong>
              <span>${client?.name || "Cliente não encontrado"}</span>
              <small>${appointment.notes || "Sem observação"}</small>
            </button>
          `;
        })
        .join("")
    : `<p class="muted">Ainda não há agendamentos para este profissional.</p>`;

  els.professionalInsights.innerHTML = renderProfessionalInsights(professional, appointments, monthAppointments, nextAppointment);
}

function renderReportMetric(label, value) {
  return `
    <div>
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderProfessionalInsights(professional, appointments, monthAppointments, nextAppointment) {
  const busiestDay = getMostFrequent(
    appointments.map((appointment) => weekdayNames[parseDateKey(appointment.date).getDay()]),
  );
  const busiestClientId = getMostFrequent(appointments.map((appointment) => appointment.clientId));
  const busiestClient = getClient(busiestClientId);
  const averageByMonth = getAverageAppointmentsByMonth(appointments);

  const insights = [
    ["Dias configurados", describeDays(professional.days)],
    ["Aparece na agenda", professional.visible || professional.fixed ? "Sim" : "Somente quando tiver agendamento"],
    ["Dia com mais agenda", busiestDay || "-"],
    ["Cliente mais recorrente", busiestClient?.name || "-"],
    ["Média por mês", appointments.length ? averageByMonth.toFixed(1) : "0"],
    ["Próximo agendamento", nextAppointment ? `${formatDateKey(nextAppointment.date)} às ${nextAppointment.time}` : "-"],
    ["Agenda deste mês", `${monthAppointments.length} agendamento(s)`],
  ];

  return insights
    .map(
      ([label, value]) => `
        <div class="insight-item">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `,
    )
    .join("");
}

function getMostFrequent(items) {
  const counts = items.filter(Boolean).reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

function getAverageAppointmentsByMonth(appointments) {
  const months = new Set(appointments.map((appointment) => appointment.date.slice(0, 7)));
  return months.size ? appointments.length / months.size : 0;
}

function renderCalendar() {
  const todayKey = toDateKey(new Date());
  const visibleProfessionals = getVisibleProfessionals();
  const rows = getMonthDays(selectedMonth)
    .map((date) => {
      const dateKey = toDateKey(date);
      const weekday = date.getDay();
      const relative = getRelativeLabel(dateKey, todayKey);
      const appointments = state.appointments
        .filter((appointment) => appointment.date === dateKey)
        .sort((a, b) => a.time.localeCompare(b.time));

      return `
        <tr class="${relative ? "highlight" : ""}">
          <td>${formatDate(date)}</td>
          <td>${weekdayNames[weekday]}${relative ? ` <strong>(${relative})</strong>` : ""}</td>
          <td>
            <input class="lead-input" type="number" min="0" value="${state.leads[dateKey] || 0}" data-lead-date="${dateKey}" aria-label="Leads de ${formatDate(date)}" />
          </td>
          ${visibleProfessionals.map((professional) => renderDoctorCell(dateKey, professional, weekday, appointments)).join("")}
        </tr>
      `;
    })
    .join("");

  els.calendarBody.innerHTML = rows;
}

function getRelativeLabel(dateKey, todayKey) {
  if (dateKey === todayKey) return "HOJE";
  if (dateKey === toDateKey(addDays(new Date(), 1))) return "AMANHÃ";
  if (dateKey === toDateKey(addDays(new Date(), 2))) return "DEPOIS DE AMANHÃ";
  return "";
}

function renderDoctorCell(dateKey, professional, weekday, appointments) {
  const available = professional.days.length === 0 || professional.days.includes(weekday);
  const doctorAppointments = appointments.filter((appointment) => appointment.doctor === professional.id);

  if (!available && doctorAppointments.length === 0) {
    return `<td class="appointment-cell" data-date="${dateKey}" data-doctor="${professional.id}"><span class="empty-dash">-</span></td>`;
  }

  if (doctorAppointments.length === 0) {
    return `<td class="appointment-cell available ${professional.color}" data-date="${dateKey}" data-doctor="${professional.id}"><span class="empty-dash">-</span></td>`;
  }

  const content = doctorAppointments
    .map((appointment) => {
      const client = getClient(appointment.clientId);
      const time = appointment.time.slice(0, 5).replace(":00", "h");
      return `<button class="appointment-pill ${professional.color}" type="button" data-edit-appointment="${appointment.id}">Agendamento: ${client?.name || "Cliente"} - ${time}</button>`;
    })
    .join("");

  return `<td class="appointment-cell available ${professional.color}" data-date="${dateKey}" data-doctor="${professional.id}"><div class="appointment-list">${content}</div></td>`;
}

function renderSummary() {
  const monthDays = getMonthDays(selectedMonth).map(toDateKey);
  const leadsTotal = monthDays.reduce((total, dateKey) => total + Number(state.leads[dateKey] || 0), 0);
  const monthAppointments = state.appointments.filter((appointment) => appointment.date.startsWith(selectedMonth));

  els.leadsTotal.textContent = leadsTotal;
  els.metricGrid.innerHTML = `
    <div>
      <span>Leads captados</span>
      <strong id="leadsTotal">${leadsTotal}</strong>
    </div>
    ${getVisibleProfessionals()
      .map((professional) => {
        const total = monthAppointments.filter((appointment) => appointment.doctor === professional.id).length;
        return `
          <div>
            <span>Agendamentos<br />${professional.name}</span>
            <strong class="${professional.color}-text">${total}</strong>
          </div>
        `;
      })
      .join("")}
  `;
  els.leadsTotal = $("#leadsTotal");
}

function renderClients() {
  const query = els.clientSearch.value.trim().toLowerCase();
  const clients = state.clients
    .filter((client) => `${client.name} ${client.phone} ${client.source}`.toLowerCase().includes(query))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  els.clientCount.textContent = `${state.clients.length} cadastrados`;
  els.clientList.innerHTML = clients.length
    ? clients
        .map(
          (client) => `
            <button class="client-item" type="button" data-edit-client="${client.id}">
              <strong>${client.name}</strong>
              <span>${client.phone || "Sem telefone"}</span>
              <span>${client.source || "Sem origem informada"}</span>
            </button>
          `,
        )
        .join("")
    : `<p class="muted">Nenhum cliente encontrado.</p>`;
}

function renderProfessionals() {
  els.professionalCount.textContent = `${state.professionals.length} cadastrados`;
  els.professionalList.innerHTML = state.professionals
    .map(
      (professional) => `
        <button class="client-item" type="button" data-edit-professional="${professional.id}">
          <strong>${professional.name}</strong>
          <span>${describeDays(professional.days)}</span>
          <span>${professional.fixed ? "Principal" : professional.visible ? "Sempre visível" : "Aparece quando tiver agendamento"}</span>
        </button>
      `,
    )
    .join("");
}

function renderAppointmentClientOptions() {
  els.appointmentClient.innerHTML = state.clients
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
    .map((client) => `<option value="${client.id}">${client.name}</option>`)
    .join("");
}

function renderAppointmentProfessionalOptions() {
  els.appointmentDoctor.innerHTML = state.professionals
    .map((professional) => `<option value="${professional.id}">${professional.name}</option>`)
    .join("");
}

function openAppointmentDialog({ appointmentId = "", date = toDateKey(new Date()), doctor = "caroline" } = {}) {
  if (state.clients.length === 0) {
    showToast("Cadastre um cliente antes de criar agendamentos.");
    openClientDialog();
    return;
  }

  const appointment = state.appointments.find((item) => item.id === appointmentId);
  els.appointmentDialogTitle.textContent = appointment ? "Editar agendamento" : "Novo agendamento";
  els.appointmentId.value = appointment?.id || "";
  els.appointmentClient.value = appointment?.clientId || state.clients[0].id;
  els.appointmentDate.value = appointment?.date || date;
  els.appointmentTime.value = appointment?.time || "09:00";
  const professionalId = appointment?.doctor || doctor;
  els.appointmentDoctor.value = getProfessional(professionalId) ? professionalId : "caroline";
  els.appointmentReminder.value = String(appointment?.reminderMinutes || state.alertSettings.defaultReminder || 30);
  els.appointmentNotes.value = appointment?.notes || "";
  els.deleteAppointmentButton.hidden = !appointment;
  els.appointmentDialog.showModal();
}

function openProfessionalDialog(professionalId = "") {
  const professional = getProfessional(professionalId);
  els.professionalDialogTitle.textContent = professional ? "Editar profissional" : "Novo profissional";
  els.professionalId.value = professional?.id || "";
  els.professionalName.value = professional?.name || "";
  els.professionalVisible.checked = Boolean(professional?.visible);
  els.professionalVisible.disabled = Boolean(professional?.fixed);
  document.querySelectorAll("[name='professionalDays']").forEach((input) => {
    input.checked = Boolean(professional?.days?.includes(Number(input.value)));
  });
  els.deleteProfessionalButton.hidden = !professional || professional.fixed;
  els.professionalDialog.showModal();
}

function openClientDialog(clientId = "") {
  const client = state.clients.find((item) => item.id === clientId);
  els.clientId.value = client?.id || "";
  els.clientName.value = client?.name || "";
  els.clientPhone.value = client?.phone || "";
  els.clientSource.value = client?.source || "";
  els.clientNotes.value = client?.notes || "";
  els.deleteClientButton.hidden = !client;
  els.clientDialog.showModal();
}

function openSettingsDialog() {
  els.soundAlerts.checked = state.alertSettings.sound;
  els.visualAlerts.checked = state.alertSettings.visual;
  els.browserAlerts.checked = state.alertSettings.browser;
  els.defaultReminder.value = String(state.alertSettings.defaultReminder || 30);
  els.settingsDialog.showModal();
}

function saveAlertSettings() {
  state.alertSettings = {
    sound: els.soundAlerts.checked,
    visual: els.visualAlerts.checked,
    browser: els.browserAlerts.checked,
    defaultReminder: Number(els.defaultReminder.value),
  };
  saveState();
}

function triggerAlert(title, body) {
  if (state.alertSettings.sound) {
    playAlertSound();
  }

  if (state.alertSettings.browser && "Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }

  if (state.alertSettings.visual) {
    showToast(`${title} - ${body}`);
  }
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => els.toast.classList.remove("show"), 3000);
}

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    showToast("Este navegador não suporta notificações.");
    return;
  }

  Notification.requestPermission().then((permission) => {
    state.alertSettings.browser = permission === "granted";
    saveState();
    showToast(permission === "granted" ? "Alertas ativados." : "Permissão de alerta não liberada.");
  });
}

function checkReminders() {
  const now = Date.now();
  state.appointments.forEach((appointment) => {
    if (notifiedIds.has(appointment.id)) return;

    const appointmentTime = new Date(`${appointment.date}T${appointment.time}:00`).getTime();
    const reminderTime = appointmentTime - Number(appointment.reminderMinutes || 30) * 60 * 1000;

    if (now >= reminderTime && now <= appointmentTime + 10 * 60 * 1000) {
      const client = getClient(appointment.clientId);
      const professional = getProfessional(appointment.doctor);
      const title = `Agenda: ${client?.name || "Cliente"} às ${appointment.time}`;
      const body = `${professional?.name || "Profissional"} em ${formatDateKey(appointment.date)}.`;

      notifiedIds.add(appointment.id);
      triggerAlert(title, body);
    }
  });
}

function playAlertSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.55);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.58);
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `agenda-inteligente-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported.clients) || !Array.isArray(imported.appointments)) {
        throw new Error("Formato inválido.");
      }
      state = normalizeState({
        selectedMonth: imported.selectedMonth || monthKeyFromDate(new Date()),
        alertSettings: imported.alertSettings,
        professionals: imported.professionals,
        clients: imported.clients,
        appointments: imported.appointments,
        leads: imported.leads || {},
        notesByMonth: imported.notesByMonth || {},
      });
      selectedMonth = state.selectedMonth;
      saveState();
      render();
      showToast("Dados importados com sucesso.");
    } catch {
      showToast("Não consegui importar este arquivo.");
    }
  };
  reader.readAsText(file);
}

els.monthPicker.addEventListener("change", () => setMonth(els.monthPicker.value));

els.prevMonth.addEventListener("click", () => {
  const [year, month] = selectedMonth.split("-").map(Number);
  setMonth(monthKeyFromDate(localDate(year, month - 2, 1)));
});

els.nextMonth.addEventListener("click", () => {
  const [year, month] = selectedMonth.split("-").map(Number);
  setMonth(monthKeyFromDate(localDate(year, month, 1)));
});

els.calendarBody.addEventListener("input", (event) => {
  const dateKey = event.target.dataset.leadDate;
  if (!dateKey) return;
  state.leads[dateKey] = Math.max(0, Number(event.target.value || 0));
  saveState();
  renderSummary();
});

els.calendarBody.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-appointment]");
  if (editButton) {
    openAppointmentDialog({ appointmentId: editButton.dataset.editAppointment });
    return;
  }

  const cell = event.target.closest("[data-date][data-doctor]");
  if (cell) {
    openAppointmentDialog({ date: cell.dataset.date, doctor: cell.dataset.doctor });
  }
});

els.calendarHead.addEventListener("dblclick", (event) => {
  const header = event.target.closest("[data-report-professional]");
  if (header) openProfessionalReport(header.dataset.reportProfessional);
});

els.legendCard.addEventListener("dblclick", (event) => {
  const item = event.target.closest("[data-report-professional]");
  if (item) openProfessionalReport(item.dataset.reportProfessional);
});

els.newAppointmentButton.addEventListener("click", () => openAppointmentDialog());
els.newClientButton.addEventListener("click", () => openClientDialog());
els.newProfessionalButton.addEventListener("click", () => openProfessionalDialog());
els.notifyButton.addEventListener("click", requestNotificationPermission);
els.settingsButton.addEventListener("click", openSettingsDialog);
els.exportButton.addEventListener("click", exportData);
els.importInput.addEventListener("change", () => {
  const [file] = els.importInput.files;
  if (file) importData(file);
  els.importInput.value = "";
});

els.notesInput.addEventListener("input", () => {
  state.notesByMonth[selectedMonth] = els.notesInput.value;
  saveState();
});

els.settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveAlertSettings();
  if (state.alertSettings.browser && "Notification" in window && Notification.permission === "default") {
    requestNotificationPermission();
  }
  els.settingsDialog.close();
  showToast("Configurações de alerta salvas.");
});

els.testAlertButton.addEventListener("click", () => {
  saveAlertSettings();
  triggerAlert("Teste da Agenda Inteligente", "Alerta sonoro e visual configurado.");
});

els.appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = els.appointmentId.value || makeId("appt");
  const appointment = {
    id,
    clientId: els.appointmentClient.value,
    date: els.appointmentDate.value,
    time: els.appointmentTime.value,
    doctor: els.appointmentDoctor.value,
    reminderMinutes: Number(els.appointmentReminder.value),
    notes: els.appointmentNotes.value.trim(),
  };

  const index = state.appointments.findIndex((item) => item.id === id);
  if (index >= 0) {
    state.appointments[index] = appointment;
  } else {
    state.appointments.push(appointment);
  }

  selectedMonth = appointment.date.slice(0, 7);
  saveState();
  els.appointmentDialog.close();
  render();
  showToast("Agendamento salvo.");
});

els.deleteAppointmentButton.addEventListener("click", () => {
  const id = els.appointmentId.value;
  state.appointments = state.appointments.filter((appointment) => appointment.id !== id);
  saveState();
  els.appointmentDialog.close();
  render();
  showToast("Agendamento excluído.");
});

els.professionalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const existing = getProfessional(els.professionalId.value);
  const id = existing?.id || makeId("pro");
  const extraIndex = state.professionals.filter((professional) => !professional.fixed).length;
  const days = Array.from(document.querySelectorAll("[name='professionalDays']:checked")).map((input) => Number(input.value));
  const professional = {
    id,
    name: els.professionalName.value.trim(),
    short: els.professionalName.value.trim().replace(/^Dr(a)?\.\s*/i, ""),
    days,
    color: existing?.color || getExtraColor(extraIndex),
    fixed: Boolean(existing?.fixed),
    visible: existing?.fixed ? true : els.professionalVisible.checked,
  };

  const index = state.professionals.findIndex((item) => item.id === id);
  if (index >= 0) {
    state.professionals[index] = professional;
  } else {
    state.professionals.push(professional);
  }

  saveState();
  els.professionalDialog.close();
  render();
  showToast("Profissional salvo.");
});

els.deleteProfessionalButton.addEventListener("click", () => {
  const id = els.professionalId.value;
  const hasAppointments = state.appointments.some((appointment) => appointment.doctor === id);
  if (hasAppointments) {
    showToast("Este profissional tem agendamentos. Exclua os agendamentos primeiro.");
    return;
  }
  state.professionals = state.professionals.filter((professional) => professional.id !== id || professional.fixed);
  saveState();
  els.professionalDialog.close();
  render();
  showToast("Profissional excluído.");
});

els.clientForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = els.clientId.value || makeId("client");
  const client = {
    id,
    name: els.clientName.value.trim(),
    phone: els.clientPhone.value.trim(),
    source: els.clientSource.value.trim(),
    notes: els.clientNotes.value.trim(),
  };

  const index = state.clients.findIndex((item) => item.id === id);
  if (index >= 0) {
    state.clients[index] = client;
  } else {
    state.clients.push(client);
  }

  saveState();
  els.clientDialog.close();
  render();
  showToast("Cliente salvo.");
});

els.deleteClientButton.addEventListener("click", () => {
  const id = els.clientId.value;
  const hasAppointments = state.appointments.some((appointment) => appointment.clientId === id);
  if (hasAppointments) {
    showToast("Este cliente tem agendamentos. Exclua os agendamentos primeiro.");
    return;
  }
  state.clients = state.clients.filter((client) => client.id !== id);
  saveState();
  els.clientDialog.close();
  render();
  showToast("Cliente excluído.");
});

els.clientSearch.addEventListener("input", renderClients);
els.clientList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-edit-client]");
  if (button) openClientDialog(button.dataset.editClient);
});

els.professionalList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-edit-professional]");
  if (button) openProfessionalDialog(button.dataset.editProfessional);
});

els.lastAppointmentsList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-edit-appointment]");
  if (button) openAppointmentDialog({ appointmentId: button.dataset.editAppointment });
});

els.editReportProfessionalButton.addEventListener("click", () => {
  if (reportProfessionalId) openProfessionalDialog(reportProfessionalId);
});

els.backToAgendaButton.addEventListener("click", () => {
  const url = new URL(window.location.href);
  url.searchParams.delete("professional");
  window.location.href = url.toString();
});

els.printReportButton.addEventListener("click", () => window.print());

document.addEventListener("click", (event) => {
  if (event.target.matches("[data-close]")) {
    event.target.closest("dialog").close();
  }
});

window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY || !event.newValue) return;
  try {
    state = normalizeState(JSON.parse(event.newValue));
    selectedMonth = state.selectedMonth || selectedMonth;
    render();
  } catch {
    showToast("Não consegui sincronizar os dados desta aba.");
  }
});

setMonth(selectedMonth);
window.setInterval(checkReminders, 30000);
checkReminders();
