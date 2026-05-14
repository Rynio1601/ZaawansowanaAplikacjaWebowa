import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

export interface ExportOptions {
  filename: string;
  title?: string;
  columns: ExportColumn[];
  data: any[];
  orientation?: 'portrait' | 'landscape';
}

export const exportToPDF = ({ filename, title, columns, data, orientation = 'portrait' }: ExportOptions) => {
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  if (title) {
    doc.setFontSize(18);
    doc.text(title, 14, 20);
  }

  const tableData = data.map(row =>
    columns.map(col => {
      const value = row[col.key];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    })
  );

  autoTable(doc, {
    head: [columns.map(col => col.header)],
    body: tableData,
    startY: title ? 30 : 20,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: columns.reduce((acc, col, index) => {
      if (col.width) {
        acc[index] = { cellWidth: col.width };
      }
      return acc;
    }, {} as any),
  });

  doc.save(`${filename}.pdf`);
};

export const exportToExcel = ({ filename, columns, data }: ExportOptions) => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(row => {
      const newRow: any = {};
      columns.forEach(col => {
        const value = row[col.key];
        newRow[col.header] = value === null || value === undefined ? '' : value;
      });
      return newRow;
    })
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  const colWidths = columns.map(col => ({
    wch: col.width ? col.width / 3 : 15
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportClientsToFile = (clients: any[], format: 'pdf' | 'excel') => {
  const columns: ExportColumn[] = [
    { header: 'Imię i nazwisko', key: 'name', width: 50 },
    { header: 'Email', key: 'email', width: 50 },
    { header: 'Telefon', key: 'phone', width: 40 },
    { header: 'Status', key: 'status', width: 30 },
    { header: 'Plan', key: 'plan', width: 40 },
    { header: 'Data rozpoczęcia', key: 'startDate', width: 35 },
  ];

  const data = clients.map(client => ({
    name: client.name,
    email: client.email,
    phone: client.phone,
    status: client.status === 'active' ? 'Aktywny' : 'Nieaktywny',
    plan: client.plan || 'Brak',
    startDate: client.startDate ? new Date(client.startDate).toLocaleDateString('pl-PL') : '',
  }));

  const options: ExportOptions = {
    filename: `klienci_${new Date().toISOString().split('T')[0]}`,
    title: 'Lista Klientów - TrainerPro',
    columns,
    data,
    orientation: 'landscape',
  };

  if (format === 'pdf') {
    exportToPDF(options);
  } else {
    exportToExcel(options);
  }
};

export const exportScheduleToFile = (sessions: any[], format: 'pdf' | 'excel') => {
  const columns: ExportColumn[] = [
    { header: 'Data', key: 'date', width: 35 },
    { header: 'Godzina', key: 'time', width: 30 },
    { header: 'Klient', key: 'client', width: 50 },
    { header: 'Typ treningu', key: 'type', width: 40 },
    { header: 'Status', key: 'status', width: 30 },
    { header: 'Notatki', key: 'notes', width: 60 },
  ];

  const data = sessions.map(session => ({
    date: new Date(session.date).toLocaleDateString('pl-PL'),
    time: session.time,
    client: session.clientName,
    type: session.type,
    status: session.status === 'completed' ? 'Ukończona' :
            session.status === 'scheduled' ? 'Zaplanowana' : 'Anulowana',
    notes: session.notes || '',
  }));

  const options: ExportOptions = {
    filename: `grafik_${new Date().toISOString().split('T')[0]}`,
    title: 'Grafik Sesji - TrainerPro',
    columns,
    data,
    orientation: 'landscape',
  };

  if (format === 'pdf') {
    exportToPDF(options);
  } else {
    exportToExcel(options);
  }
};

export const exportPaymentsToFile = (payments: any[], format: 'pdf' | 'excel') => {
  const columns: ExportColumn[] = [
    { header: 'Data', key: 'date', width: 35 },
    { header: 'Klient', key: 'client', width: 50 },
    { header: 'Kwota', key: 'amount', width: 30 },
    { header: 'Status', key: 'status', width: 30 },
    { header: 'Metoda', key: 'method', width: 30 },
    { header: 'Opis', key: 'description', width: 60 },
  ];

  const data = payments.map(payment => ({
    date: new Date(payment.date).toLocaleDateString('pl-PL'),
    client: payment.clientName,
    amount: `${payment.amount} PLN`,
    status: payment.status === 'paid' ? 'Opłacona' :
            payment.status === 'pending' ? 'Oczekująca' : 'Anulowana',
    method: payment.method === 'card' ? 'Karta' :
            payment.method === 'cash' ? 'Gotówka' : 'Przelew',
    description: payment.description || '',
  }));

  const options: ExportOptions = {
    filename: `platnosci_${new Date().toISOString().split('T')[0]}`,
    title: 'Historia Płatności - TrainerPro',
    columns,
    data,
    orientation: 'landscape',
  };

  if (format === 'pdf') {
    exportToPDF(options);
  } else {
    exportToExcel(options);
  }
};

export const exportPlansToFile = (plans: any[], format: 'pdf' | 'excel') => {
  const columns: ExportColumn[] = [
    { header: 'Nazwa planu', key: 'name', width: 60 },
    { header: 'Klient', key: 'client', width: 50 },
    { header: 'Czas trwania', key: 'duration', width: 35 },
    { header: 'Liczba treningów', key: 'workouts', width: 35 },
    { header: 'Status', key: 'status', width: 30 },
  ];

  const data = plans.map(plan => ({
    name: plan.name,
    client: plan.clientName || 'Nie przypisany',
    duration: `${plan.duration} tygodni`,
    workouts: plan.workouts?.length || 0,
    status: plan.status === 'active' ? 'Aktywny' : 'Nieaktywny',
  }));

  const options: ExportOptions = {
    filename: `plany_${new Date().toISOString().split('T')[0]}`,
    title: 'Plany Treningowe - TrainerPro',
    columns,
    data,
    orientation: 'landscape',
  };

  if (format === 'pdf') {
    exportToPDF(options);
  } else {
    exportToExcel(options);
  }
};
