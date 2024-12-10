import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { Product } from "@/app/types/product.type";

interface IProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onEditSuccess: () => void;
  id: string | number;
}

const AppEditModal = (props: IProps) => {
  const { show, setShow, onEditSuccess, id } = props;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sold, setSold] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !show) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/product/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data.data);
        setName(data.data.name || "");
        setBrand(data.data.brand || "");
        setPrice(data.data.price || "");
        setStock(data.data.stock || "");
        setSold(data.data.sold || "");
        setDescription(data.data.description || "");
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, show]);

  const handleCloseModal = () => {
    setShow(false);
    setProduct(null);
    setName("");
    setBrand("");
    setPrice("");
    setStock("");
    setSold("");
    setDescription("");
  };

  const handleSubmit = () => {
    if (!name || !brand || !price || !stock || !sold || !description) {
      toast.error("Please fill all fields");
      return;
    }

    fetch(`/api/product/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        brand,
        price: Number(price),
        stock: Number(stock),
        sold: Number(sold),
        description,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          toast.success("Product updated successfully!");
          onEditSuccess();
          handleCloseModal();
        }
      })
      .catch(() => {
        toast.error("Failed to update product.");
      });
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={handleCloseModal} backdrop="static" keyboard={false} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div>Loading product data...</div>
        ) : error ? (
          <div className="text-danger">Error: {error}</div>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sold</Form.Label>
              <Form.Control type="number" value={sold} onChange={(e) => setSold(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppEditModal;
