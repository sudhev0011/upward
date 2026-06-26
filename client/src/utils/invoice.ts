import { BookingListItem } from "@/interfaces/bookings/bookings.interface";

export const generateAndDownloadInvoice = (booking: BookingListItem) => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) return;

  const clientName = booking.client?.name || "Client";
  const clientEmail = booking.client?.email || "";
  const providerName = booking.provider?.name || "Provider";
  const providerEmail = booking.provider?.email || "";
  const serviceName = booking.service?.name || "Professional Services";
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const invoiceDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTotal = booking.totalAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedPaid = booking.paidAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedRefund = booking.refundAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedRemaining = booking.remainingAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${booking.bookingId}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 40px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: 800;
          color: #719FC4;
          letter-spacing: -0.5px;
        }
        .invoice-title {
          text-align: right;
        }
        .invoice-title h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
          color: #0f172a;
        }
        .invoice-title p {
          margin: 5px 0 0 0;
          font-size: 12px;
          color: #64748b;
          font-family: monospace;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .details-block h3 {
          margin: 0 0 10px 0;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
        }
        .details-block p {
          margin: 3px 0;
          font-size: 14px;
        }
        .details-block .name {
          font-weight: 700;
          color: #0f172a;
        }
        .details-block .meta-label {
          color: #64748b;
          font-size: 12px;
          display: inline-block;
          width: 120px;
        }
        .details-block .meta-val {
          font-weight: 600;
          color: #1e293b;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background-color: #f8fafc;
          border-bottom: 2px solid #cbd5e1;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 12px;
          text-align: left;
        }
        td {
          border-bottom: 1px solid #e2e8f0;
          padding: 12px;
          font-size: 14px;
          color: #334155;
        }
        .item-desc {
          font-weight: 600;
          color: #0f172a;
        }
        .item-desc small {
          display: block;
          font-weight: 400;
          color: #64748b;
          margin-top: 4px;
        }
        .summary-wrapper {
          display: flex;
          justify-content: flex-end;
        }
        .summary-table {
          width: 320px;
          margin-bottom: 0;
        }
        .summary-table td {
          padding: 8px 12px;
          border-bottom: none;
        }
        .summary-table tr.total-row td {
          border-top: 2px solid #e2e8f0;
          border-bottom: 2px solid #e2e8f0;
          font-weight: 700;
          color: #0f172a;
          font-size: 16px;
        }
        .summary-table .amount {
          text-align: right;
          font-weight: 600;
        }
        .badge {
          display: inline-block;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: 4px;
          border: 1px solid;
        }
        .badge-paid {
          background-color: #f0fdf4;
          color: #16a34a;
          border-color: #bbf7d0;
        }
        .badge-partial {
          background-color: #fffbeb;
          color: #d97706;
          border-color: #fde68a;
        }
        .badge-unpaid {
          background-color: #fef2f2;
          color: #dc2626;
          border-color: #fecaca;
        }
        .badge-refunded {
          background-color: #f8fafc;
          color: #475569;
          border-color: #cbd5e1;
        }
        .footer {
          margin-top: 60px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          text-align: center;
          font-size: 11px;
          color: #94a3b8;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">UPWARD</div>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">Services Marketplace Platform</p>
        </div>
        <div class="invoice-title">
          <h1>INVOICE</h1>
          <p>REF ID: ${booking.bookingId}</p>
        </div>
      </div>

      <div class="details-grid">
        <div class="details-block">
          <h3>Billed To (Client)</h3>
          <p class="name">${clientName}</p>
          <p>${clientEmail}</p>
        </div>
        <div class="details-block">
          <h3>Serviced By (Provider)</h3>
          <p class="name">${providerName}</p>
          <p>${providerEmail}</p>
        </div>
      </div>

      <div class="details-grid" style="margin-bottom: 30px;">
        <div class="details-block">
          <h3>Booking Info</h3>
          <p><span class="meta-label">Booking Date:</span><span class="meta-val">${bookingDate}</span></p>
          <p><span class="meta-label">Service Type:</span><span class="meta-val" style="text-transform: capitalize;">${booking.bookingMode}</span></p>
          <p><span class="meta-label">Payment Method:</span><span class="meta-val" style="text-transform: uppercase;">${booking.paymentType.replace(/_/g, " ")}</span></p>
        </div>
        <div class="details-block">
          <h3>Invoice Info</h3>
          <p><span class="meta-label">Invoice Date:</span><span class="meta-val">${invoiceDate}</span></p>
          <p><span class="meta-label">Status:</span><span class="meta-val">
            <span class="badge badge-${booking.paymentStatus.toLowerCase()}">${booking.paymentStatus}</span>
          </span></p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Service Description</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="item-desc">
                ${serviceName}
                <small>Professional services delivered via Upward Platform</small>
              </div>
            </td>
            <td style="text-align: right; font-weight: 600;">₹${formattedTotal}</td>
          </tr>
        </tbody>
      </table>

      <div class="summary-wrapper">
        <table class="summary-table">
          <tr>
            <td>Base Service Valuation:</td>
            <td class="amount">₹${formattedTotal}</td>
          </tr>
          <tr>
            <td style="color: #16a34a;">Liquid Funds Settled:</td>
            <td class="amount" style="color: #16a34a;">- ₹${formattedPaid}</td>
          </tr>
          ${booking.refundAmount > 0 ? `
          <tr>
            <td style="color: #dc2626;">Returned / Refunded:</td>
            <td class="amount" style="color: #dc2626;">+ ₹${formattedRefund}</td>
          </tr>
          ` : ""}
          <tr class="total-row">
            <td>Outstanding Balance:</td>
            <td class="amount">₹${formattedRemaining}</td>
          </tr>
        </table>
      </div>

      <div class="footer">
        <p>Thank you for choosing Upward Marketplace! For billing support or questions, contact support@upward.com</p>
        <p style="margin-top: 5px; color: #cbd5e1;">This is a computer-generated billing receipt. No physical signature is required.</p>
      </div>
    </body>
    </html>
  `;

  doc.open();
  doc.write(htmlContent);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
};
