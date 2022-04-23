import React, { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { marketplaceAddress } from "../config";
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const CreateAdd = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  async function uploadToIPFS() {
    const { title, description, price } = formInput;
    if (!title || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      title,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function listItemForRent(event) {
    event.preventDefault();
    setLoading(true);
    const url = await uploadToIPFS();
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      signer
    );
    let transaction = await contract.createToken(url, price);

    await transaction.wait();
    setLoading(false);
    navigate("/listed");
  }

  if (loading) {
    return (
      <div className="container mt-3">
        <ClipLoader loading={loading} color="blue" size={35} />
      </div>
    );
  }

  return (
    <div className="container mt-2">
      <h1>Create Add</h1>
      <form>
        <div className="form-group mb-2">
          <label htmlFor="title">Title</label>
          <input
            id="#title"
            name="title"
            placeholder="Title of the rental..."
            className="form-control"
            onChange={(e) =>
              updateFormInput({ ...formInput, title: e.target.value })
            }
          />
        </div>
        <div className="form-group mb-2">
          <label htmlFor="description">Description</label>
          <textarea
            id="#description"
            name="description"
            placeholder="Description of the rental..."
            className="form-control"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="price">Price</label>
          <input
            id="#price"
            name="price"
            placeholder="Price of the rental in Eth..."
            className="form-control"
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
        </div>
        <div className="form-group mb-3">
          <input
            id="#image"
            name="image"
            type="file"
            className="form-control-file mb-1"
            onChange={onChange}
          />
          {fileUrl && (
            <img className="" width="150" src={fileUrl} alt="Rental" />
          )}
        </div>
        <div className="form-group mb-3">
          <button
            onClick={listItemForRent}
            type="submit"
            className="btn btn-primary"
          >
            Create Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdd;
