import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { toast } from "react-toastify";
interface IProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onAddSuccess: () => void;
}
const AppModal = (props: IProps) => {
  const { show, setShow, onAddSuccess } = props;
  const[name, setName] = useState("");
  const[brand, setBrand] = useState("");
  const[price, setPrice] = useState("");
  const[stock, setStock] = useState("");
  const[sold, setSold] = useState("");
  const[description, setDescription] = useState("");
  const handleCloseModal = () => {
    setShow(false);
    setName("");
    setBrand("");
    setPrice("");
    setStock("");
    setSold("");
    setDescription("");
  };
  const handleSubmit = () => {
    if (name === "" || brand === "" || price === "" || stock === "" || sold === "" || description === "") {
      toast.error("Please fill all fields");
      return;
    }
      fetch("/api/product", {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, brand, price: Number(price), stock: Number(stock), sold: Number(sold), description }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res) {
            toast.success("Add new product success");
            onAddSuccess();
            handleCloseModal();
        
          }
        });
  };
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal  show={show}
        onHide={() => handleCloseModal()}
        backdrop="static"
        keyboard={false}
        size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="..." value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Brand</Form.Label>
              <Form.Control type="text" placeholder="..." value={brand} onChange={(e) => setBrand(e.target.value)}  />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)}  />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)}  />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Sold</Form.Label>
              <Form.Control type="number" placeholder="0" value={sold} onChange={(e) => setSold(e.target.value)}  />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}  />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
        <Button variant="secondary" onClick={() => handleCloseModal()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSubmit()}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppModal;
