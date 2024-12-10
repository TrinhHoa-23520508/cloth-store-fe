"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Container from "react-bootstrap/Container";
import TableProduct from "@/components/app.tableProduct";

import { Product } from "@/app/types/product.type";

import { useEffect, useState } from "react";

interface ResponseData<D> {
  data: D | D[];
  status: number;
  message: string;
}

const HomePage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    const url = "/api/product";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className="py-5">
        <Container>
          <TableProduct
            products={products.sort(function (a: any, b: any) {
              return b.id - a.id || b.title.localeCompare(a.title);
            })}
            refetch={fetchProducts}
          />
        </Container>
      </div>
    </>
  );
};

export default HomePage;
