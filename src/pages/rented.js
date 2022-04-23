import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { marketplaceAddress } from "../config";
import ClipLoader from "react-spinners/ClipLoader";
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";

const Rented = () => {
  const [marketItems, setMarketItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMarketItems();
  }, []);

  async function loadMarketItems() {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      signer
    );
    const data = await marketplaceContract.fetchMyRented();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          renter: i.renter,
          owner: i.owner,
          image: meta.data.image,
          title: meta.data.title,
          description: meta.data.description,
          tokenURI,
        };
        return item;
      })
    );
    setMarketItems(items.reverse());
    setLoading(false);
  }
  if (!loading && !marketItems.length)
    return (
      <div className="container mt-3">
        <h1 className="">Rented by Me</h1>
        <p className="">No homes rented by me yet.</p>
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
      <h1 className="">Rented By Me</h1>
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
              <div className="col-12 col-md-8">
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rented;
