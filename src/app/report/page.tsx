// pages/report/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button, Table } from "react-bootstrap";
import { Product } from "@/app/types/product.type"; // Import type product nếu cần
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.data);
      } catch (error) {
        toast.error("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  // Tính toán tổng số sản phẩm, tổng giá trị tồn kho, v.v...
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalSales = products.reduce((sum, product) => sum + product.sold, 0);
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Product Report", 14, 22);

    // Add summary
    doc.setFontSize(12);
    doc.text(`Total Products: ${products.length}`, 14, 32);
    doc.text(`Total Stock: ${totalStock}`, 14, 39);
    doc.text(`Total Sales: ${totalSales}`, 14, 46);
    doc.text(`Total Value: $${totalValue}`, 14, 53);

    // Add products table
    autoTable(doc, {
      startY: 60,
      head: [["No", "Name", "Brand", "Price", "Stock", "Sold", "Value"]],
      body: products.map((product, index) => [
        index + 1,
        product.name,
        product.brand,
        `$${product.price}`,
        product.stock,
        product.sold,
        `$${product.price * product.stock}`,
      ]),
    });

    // Save the PDF
    doc.save("product-report.pdf");
    toast.success("Report Generated Successfully!");
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">Product Report</h1>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Products</Card.Title>
              <Card.Text>{products.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Stock</Card.Title>
              <Card.Text>{totalStock}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Sales</Card.Title>
              <Card.Text>{totalSales}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Products List</Card.Title>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sold</th>
                <th>Value</th>
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
                  <td>{product.sold}</td>
                  <td>{product.price * product.stock}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Row className="mt-4">
        <Col md={12} className="d-flex justify-content-center">
          <Button variant="primary" onClick={generatePDF}>
            Generate Report
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportPage;
