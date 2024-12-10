"use client";

import { useEffect, useState } from "react";
import { Product } from "@/app/types/product.type";
import { Container, Card, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

// Thêm hàm async để unwrap `params`
async function unwrapParams(paramsPromise: Promise<{ id: string }>) {
  return await paramsPromise;
}

const ProductDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unwrappedParams = await unwrapParams(params);
        const { id } = unwrappedParams;

        const url = `/api/product/${id}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error)
    return <div className="alert alert-danger m-5">Error: {error}</div>;
  if (!product)
    return <div className="alert alert-warning m-5">Product not found</div>;

  return (
    <Container className="py-5">
      <Button
        variant="secondary"
        className="mb-4"
        onClick={() => router.back()}
      >
        &larr; Back
      </Button>

      <Card>
        <Card.Header as="h5">Product Details</Card.Header>
        <Card.Body>
          <Card.Title>{product?.name}</Card.Title>
          <div className="mb-3">
            <strong>Brand:</strong> {product?.brand}
          </div>
          <div className="mb-3">
            <strong>Price:</strong> ${product?.price}
          </div>
          <div className="mb-3">
            <strong>Stock:</strong> {product?.stock}
          </div>
          <div className="mb-3">
            <strong>Sold:</strong> {product?.sold}
          </div>
          <div className="mb-3">
            <strong>Description:</strong>
            <p>{product?.description}</p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductDetail;





