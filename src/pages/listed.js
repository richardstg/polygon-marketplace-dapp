import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { marketplaceAddress } from "../config";
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";

const Listed = () => {
  const [marketItems, setMarketItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMarketItems();
  }, []);

  async function loadMarketItems() {
    setLoading(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const contract = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      provider
    );
    const data = await contract.fetchItemsListed();

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
    setLoading(false);
  }
  if (!loading && !marketItems.length)
    return (
      <div className="container mt-3">
        <h1 className="">Listed By Me</h1>
        <p className="">No homes listed by me yet.</p>
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
      <h1 className="">Currently Listed by Me</h1>
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

export default Listed;
