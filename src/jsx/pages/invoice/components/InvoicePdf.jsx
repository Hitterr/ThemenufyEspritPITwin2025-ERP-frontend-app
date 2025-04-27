import { jsPDF } from "jspdf";
import { format } from "date-fns";
import Logo from "../../../../assets/images/logo.png";

// Fonction pour générer le PDF
const generatePDF = (currentInvoice, currentUser, ingredients) => {
  const doc = new jsPDF();

  const marginLeft = 10;
  const marginRight = 110;
  const startY = 100;
  const lineHeight = 10;
  const orangeColor = "#F25C05"; // Orange
  const whiteColor = "#FFFFFF"; // Blanc
  const blackColor = "#000000"; // Noir

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  // Ajouter le logo au centre
  const pageWidth = doc.internal.pageSize.getWidth();
  const imgWidth = 50;
  const imgX = (pageWidth - imgWidth) / 2;
  doc.addImage(Logo, "PNG", imgX, 10, imgWidth, 50);

  // --- INFOS FACTURE à DROITE ---
  doc.setFontSize(20);
  doc.setTextColor(orangeColor);
  doc.setFont(undefined, "bold");
  doc.text("FACTURE", 10, 70);

  doc.setFontSize(12);
  doc.setTextColor(blackColor);
  doc.setFont(undefined, "normal");

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
    doc.text(text, pageWidth - 10, 70 + index * 8, { align: "right" });
  });

  // --- INFOS "From" ---
  doc.setFont(undefined, "bold");
  doc.text("From:", marginLeft, startY);
  doc.setFont(undefined, "normal");
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

  // --- INFOS "To" ---
  doc.setFont(undefined, "bold");
  doc.text("To:", marginRight, startY);
  doc.setFont(undefined, "normal");
  doc.text(
    `${currentInvoice?.supplier?.name || ""}`,
    marginRight,
    startY + lineHeight
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

  // --- TABLEAU DES PRODUITS ---
  const tableStartY = startY + 6 * lineHeight + 10;

  doc.setFillColor(242, 92, 5); // orange
  doc.rect(10, tableStartY - 8, 190, 10, "F");

  doc.setTextColor(whiteColor);
  doc.setFont(undefined, "bold");
  doc.text("Item", 15, tableStartY);
  doc.text("Unit Cost", 80, tableStartY);
  doc.text("Quantity", 130, tableStartY);
  doc.text("Total", 170, tableStartY);

  doc.setTextColor(blackColor);
  doc.setFont(undefined, "normal");

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
    doc.text(`${ingredient?.libelle || "Unknown"}`, 15, y);
    doc.text(`${item?.price} TND`, 80, y);
    doc.text(`${item?.quantity}`, 130, y);
    doc.text(`${(item?.price * item?.quantity).toFixed(3)} TND`, 170, y);
  });

  // --- TOTALS ---
  const totalStartY = tableStartY + 10 + (sortedItems?.length || 0) * 10 + 10;
  const subtotal = currentInvoice?.total?.toFixed(3);
  const vat = (currentInvoice?.total * 0.19)?.toFixed(3);
  const total = (currentInvoice?.total * 1.19)?.toFixed(3);

  doc.setFont(undefined, "bold");
  doc.text(`Subtotal: ${subtotal} TND`, 10, totalStartY);
  doc.text(`VAT (19%): ${vat} TND`, 10, totalStartY + 10);
  doc.text(`Total: ${total} TND`, 10, totalStartY + 20);

  // --- LIGNE ORANGE EN BAS ---
  doc.setDrawColor(242, 92, 5);
  doc.line(10, 280, 200, 280);

  // --- ENREGISTRER PDF ---
  doc.save(`Invoice_${currentInvoice?.invoiceNumber}.pdf`);
};

export default generatePDF;
