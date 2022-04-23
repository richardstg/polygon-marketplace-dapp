import React from "react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

import { marketplaceAddress } from "../config";

import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { dummyAvailable } from "../data/dummy";

const Available = () => {
  const [marketItems, setMarketItems] = useState([]);
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    // loadMarketItems();
    setMarketItems(dummyAvailable);
  }, []);

  async function loadMarketItems() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const contract = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      provider
    );
    const data = await contract.fetchMarketItems();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          renter: i.renter,
          owner: i.owner,
          image: meta.data.image,
          title: meta.data.title,
          description: meta.data.description,
        };
        return item;
      })
    );
    setMarketItems(items.reverse());
  }
  async function rentItem(item) {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      signer
    );

    const price = ethers.utils.parseUnits(item.price.toString(), "ether");
    const transaction = await contract.executeMarketRent(item.tokenId, {
      value: price,
    });
    await transaction.wait();
    setLoading(false);
    navigate("/rented");
  }
  if (!loading && !marketItems.length)
    return (
      <div className="container mt-3">
        <h1>Available homes for rent</h1>
        <p className="">No available homes for rent.</p>
      </div>
    );
  if (loading) {
    return (
      <div className="container mt-3">
        <ClipLoader loading={loading} color="blue" size={35} />
      </div>
    );
  }
  return (
    <div className="container mt-3">
      <h1 className="">Available for Rent</h1>
      <ul className="list-unstyled">
        {marketItems.map((marketItem, i) => (
          <li key={i} className="overflow-hidden">
            <div className="row">
              <div className="col-12 col-md-4">
                <img
                  src={marketItem.image}
                  className="w-100 mb-1"
                  alt="Rental"
                />
              </div>
              <div className="col-12 col-md-6">
                <h5 className="">{marketItem.title}</h5>
                <p className="mb-0 fw-bold">
                  <span className="fw-bold">Price: </span>
                  {marketItem.price} ETH
                </p>
                <p className="">
                  {marketItem.description
                    ? marketItem.description.length > 160
                      ? marketItem.description.substring(0, 160) + "..."
                      : marketItem.description
                    : "No description."}
                </p>
              </div>
              <div className="col-12 col-md-2">
                <button
                  className="mb-3 btn btn-primary"
                  onClick={() => rentItem(marketItem)}
                >
                  Rent
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Available;
