"use client";
import { Table, Button } from "react-bootstrap";
import { Product } from "@/app/types/product.type";
import Modal from "./app.modal";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import EditModal from "./app.editModal";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Dropdown } from "react-bootstrap";

interface IProps {
  products: Product[];
  refetch: () => void;
}

const TableProduct = ({ products, refetch }: IProps) => {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [id, setId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!products || products.length === 0) {
    return <div className="alert alert-warning">No products found</div>;
  }

  const handleView = (id: string | number) => {
    router.push(`/product/${id}`);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm(`Do you want to delete this product (id = ${id})`)) {
      try {
        const response = await fetch(`/api/product/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Delete failed");
        }

        toast.success("Delete product succeed!");
        await refetch();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleEdit = (id: string | number) => {
    setShowEdit(true);
    setId(id.toString());
  };
  const handleImport = () => {
    console.log("Import");
  };

  const handleExport = () => {
    try {
      // Chuẩn bị dữ liệu để xuất
      const exportData = products.map(({ id, ...rest }) => ({
        ...rest,
      }));

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Products");

      // Tải xuống file
      XLSX.writeFile(wb, "products.xlsx");

      toast.success("Export products successfully!");
    } catch (error) {
      console.error("Error exporting:", error);
      toast.error("Failed to export products");
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();

      // Thêm tiêu đề
      doc.setFontSize(16);
      doc.text("Products List", 14, 15);

      // Chuẩn bị dữ liệu cho bảng
      const tableColumn = [
        "No",
        "Name",
        "Brand",
        "Price",
        "Stock",
        "Description",
      ];
      const tableRows = products.map((product, index) => [
        index + 1,
        product.name,
        product.brand,
        product.price,
        product.stock,
        product.description,
      ]);

      // Tạo bảng
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 10 }, // No
          1: { cellWidth: 40 }, // Name
          2: { cellWidth: 30 }, // Brand
          3: { cellWidth: 20 }, // Price
          4: { cellWidth: 20 }, // Stock
          5: { cellWidth: "auto" }, // Description
        },
      });

      // Tải xuống file PDF
      doc.save("products.pdf");
      toast.success("Export PDF successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <>
      <div className="my-3">
        <div className="d-flex justify-content-between align-items-center">
          <h3>Table Products</h3>
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={() => setShow(true)}>
              Add New
            </Button>
            <div style={{ position: "relative" }}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".xlsx, .xls"
              />
              <Button variant="primary" onClick={handleImport}>
                Import
              </Button>
            </div>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Export
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleExport}>
                  Export Excel
                </Dropdown.Item>
                <Dropdown.Item onClick={handleExportPDF}>
                  Export PDF
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Phần bảng sản phẩm */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.brand}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.description}</td>
              <td>
                <Button
                  variant="info"
                  className="mx-1"
                  onClick={() => handleView(product.id)}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  className="mx-1"
                  onClick={() => handleEdit(product.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="mx-1"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={show} setShow={setShow} onAddSuccess={refetch} />
      <EditModal
        show={showEdit}
        setShow={setShowEdit}
        id={id}
        onEditSuccess={refetch}
      />
    </>
  );
};

export default TableProduct;
