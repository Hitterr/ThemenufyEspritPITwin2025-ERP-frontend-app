import { jsPDF } from "jspdf";
import { format } from "date-fns";
import Logo from "../../../../assets/images/logo.png";

const generatePDF = (currentInvoice, currentUser, ingredients) => {
  const doc = new jsPDF();

  const marginLeft = 15;
  const marginRight = 140;
  const startY = 80;
  const lineHeight = 6;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const lightPink = [255, 230, 230];

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);

  doc.setFillColor(...lightPink);
  doc.rect(0, 0, pageWidth, 60, "F");

  const imgWidth = 45;
  const imgHeight = 45;
  const imgX = (pageWidth - imgWidth) / 2;
  doc.addImage(Logo, "PNG", imgX, 10, imgWidth, imgHeight);

  doc.setFontSize(12);
  doc.setFont("Helvetica", "normal");
  const invoiceInfos = [
    `Invoice: #${currentInvoice?.invoiceNumber || "N/A"}`,
    `Date: ${
      currentInvoice?.createdAt
        ? format(new Date(currentInvoice.createdAt), "dd-MM-yyyy")
        : "N/A"
    }`,
    `Status: ${currentInvoice?.status?.toUpperCase() || "N/A"}`,
    `Paid Status: ${currentInvoice?.paidStatus?.toUpperCase() || "N/A"}`,
  ];

  invoiceInfos.forEach((text, index) => {
    doc.text(text, 10, 10 + index * 5);
  });

  doc.setFont("Helvetica", "bold");
  doc.text("From:", marginLeft, startY);
  doc.setFont("Helvetica", "normal");
  doc.text("The Menufy", marginLeft, startY + lineHeight);
  doc.text(
    `Created By: ${currentInvoice?.created_by?.firstName || ""} ${
      currentInvoice?.created_by?.lastName || ""
    }`,
    marginLeft,
    startY + 2 * lineHeight
  );
  doc.text(
    `Email: ${currentInvoice?.created_by?.email || ""}`,
    marginLeft,
    startY + 3 * lineHeight
  );
  doc.text(
    `Phone: ${currentUser?.user?.phone || "N/A"}`,
    marginLeft,
    startY + 4 * lineHeight
  );

  doc.setFont("Helvetica", "bold");
  doc.text("To:", marginRight, startY);

  doc.setFont("Helvetica", "normal");
  doc.text(
    `${currentInvoice?.supplier?.name || ""}`,
    marginRight,
    startY + 1 * lineHeight
  );
  doc.text(
    `Attn: ${currentInvoice?.supplier?.contact?.representative || "N/A"}`,
    marginRight,
    startY + 2 * lineHeight
  );
  doc.text(
    `${currentInvoice?.supplier?.address?.city || "N/A"}`,
    marginRight,
    startY + 3 * lineHeight
  );
  doc.text(
    `Email: ${currentInvoice?.supplier?.contact?.email || "N/A"}`,
    marginRight,
    startY + 4 * lineHeight
  );
  doc.text(
    `Phone: ${currentInvoice?.supplier?.contact?.phone || "N/A"}`,
    marginRight,
    startY + 5 * lineHeight
  );

  const tableStartY = startY + 6 * lineHeight + 10;

  doc.setFillColor(...lightPink);
  doc.rect(15, tableStartY - 6, 180, 8, "F");
  doc.setFont("Helvetica", "bold");
  doc.text("DESCRIPTION", 20, tableStartY);
  doc.text("PRICE", 100, tableStartY);
  doc.text("QTY", 140, tableStartY);
  doc.text("TOTAL", 170, tableStartY);

  doc.setFont("Helvetica", "normal");
  const sortedItems = currentInvoice?.items?.sort((a, b) => {
    const ingredientA = ingredients.find((ing) => ing._id === a.ingredient);
    const ingredientB = ingredients.find((ing) => ing._id === b.ingredient);
    if (ingredientA && ingredientB) {
      return ingredientA.libelle.localeCompare(ingredientB.libelle);
    }
    return 0;
  });

  sortedItems?.forEach((item, index) => {
    const ingredient = ingredients.find((ing) => ing._id === item.ingredient);
    const y = tableStartY + 10 + index * 10;

    if (index % 2 === 0) {
      doc.setFillColor(255, 230, 240);
      doc.rect(15, y - 6, 180, 8, "F");
    }
    doc.text(`${item?.ingredient?.libelle || "Unknown"}`, 20, y);
    doc.text(`${item?.price} TND`, 100, y);
    doc.text(`${item?.quantity}`, 140, y);
    doc.text(`${(item?.price * item?.quantity).toFixed(3)} TND`, 170, y);
  });

  const totalStartY = tableStartY + 10 + (sortedItems?.length || 0) * 10 + 10;
  const subtotal = currentInvoice?.total?.toFixed(3);
  const vat = (currentInvoice?.total * 0.19)?.toFixed(3);
  const total = (currentInvoice?.total * 1.19)?.toFixed(3);

  doc.setFont("Helvetica", "bold");
  doc.text(`SUBTOTAL: ${subtotal} TND`, pageWidth - 15, totalStartY, {
    align: "right",
  });
  doc.text(`TVA (19%): ${vat} TND`, pageWidth - 15, totalStartY + 10, {
    align: "right",
  });
  doc.text(`TOTAL: ${total} TND`, pageWidth - 15, totalStartY + 20, {
    align: "right",
  });

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Pay to:", marginLeft, pageHeight - 40);
  doc.text("The Menufy", marginLeft, pageHeight - 35);

  const rectX = pageWidth - 60;
  const rectY = pageHeight - 45;
  const rectWidth = 45;
  const rectHeight = 15;

  doc.setFillColor(255, 230, 240);
  doc.rect(rectX, rectY, rectWidth, rectHeight, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);

  const centerX = rectX + rectWidth / 2;
  const centerY = rectY + rectHeight / 2 + 5;

  doc.text("Thank you!", centerX, centerY, { align: "center" });

  -doc.save(`Invoice_${currentInvoice?.invoiceNumber}.pdf`);
};

export default generatePDF;
