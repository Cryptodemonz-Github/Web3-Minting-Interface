import { useState } from "react";
import Web3 from "web3";
import DemonzABI from "../abis/Demonz";

const PresaleForm = ({ account, active }) => {

    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(
        DemonzABI,
        "0xAE16529eD90FAfc927D774Ea7bE1b95D826664E3"
    );
    const [amount, setAmount] = useState(1);

    const buyToken = async () => {
        if (active) {
            try {
                await contract.methods
                    .preMint(amount)
                    .send({ from: account });
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("please connect to metamask");
        }
    };

    const checkValue = () => {
        if (amount <= 0) {
            setAmount(1);
        } else if (amount > 20) {
            setAmount(20);
        }
    };


    return (
        <div className="row">
            <div className="col-lg-8 form-tabbed">
                <div className="form-group text-center">
                    <label htmlFor="exampleInputEmail1">
                        <img
                            src="images/Satan.gif"
                            className="welcome-gif"
                            alt="Welcome to the minting section"
                        />
                        <h1>
                            <u>Presale</u>
                        </h1>
                        <p>Pay your gas fee & claim your presale token</p>
                        <div class="input-group mb-3">
                        {checkValue()}
                            <input
                                type="number"
                                className="form-control number-custom"
                                id="exampleInputEmail1"
                                min="1"
                                max="20"
                                placeholder=""
                                value={amount}
                                onChange={(event) => {
                                        setAmount(event.target.value);
                                    }}
                            />

                            <span class="input-group-text">NFT</span>
                        </div>

                        <p>Click to claim your tokens!</p>
                    </label>
                    <br />
                    <button type="button" className="btn btn-primary" onClick={buyToken}>
                        Claim!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PresaleForm;
