import { getQueriesForElement } from "@testing-library/react";
import { useState } from "react";
import Web3 from "web3";
import DemonzABI from "../abis/Demonz";

const MintForm = ({ account, active }) => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(
        DemonzABI,
        "0xAE16529eD90FAfc927D774Ea7bE1b95D826664E3"
    );
    const [ethPrice, setEthPrice] = useState(1);
    const [amount, setAmount] = useState(1);
    const [popupData, setPopupData] = useState([false]);
    //const [gasPrice, setGasPrice] = useState('');

    const buyToken = async () => {

        let gasLimit = Math.trunc(await getGasLimit());

        if (active) {
            try {
                setPopupData(["gas"]);

                await contract.methods.mintToken(amount).send({
                    from: account,
                    value: amount * web3.utils.toWei("0.06", "ether"),
                    gasPrice:  getGas(),
                    gasLimit: gasLimit,
                    //gasLimit: "285000",
                    maxPriorityFeePerGas: null,
                    maxFeePerGas: null,
                    nonce: null,
                });
            } catch (err) {
                console.log(err);
                //TODO dont throw error alert if user just rejects transaction
                setPopupData(["error", err]);
            }
        } else {
            setPopupData(["metamask"]);
        }
    };
    //this has a visual bug, user can put as many zeros as he wants before first non-zero int
    //TODO find better solution
    //note, if setEthPrice(0) is not a good solution
    const checkValue = () => {
        if (ethPrice > 20) {
            setEthPrice(20);
        }
    };

    const getGas = () => {
        web3.eth.getGasPrice().then((price) => {
            let gwei = web3.utils.fromWei(price, "gwei");

            return price;
        });
    };

    const getGasLimit = async () => {
        const gas = await web3.eth.getBlock('latest')
            .then((block) => {
                return block.gasLimit / block.transactions.length;
            });

        return gas;
    }

    const hidePopup = () => {
        setPopupData([false]);
    };

    const errorController = () => {
        if (popupData[0] === false) {
            return;
        } else if (popupData[0] === "error") {
            return (
                <div className="modal-container">
                    <div className="alert alert-dismissible alert-danger">
                        <button
                            type="button"
                            className="btn-close"
                            onClick={hidePopup}
                        ></button>
                        <strong>Oh snap!</strong>
                        <p className="text-dark">
                            It looks like an Error occured, please copy the text
                            below and send a PM to the CDZ Report bot
                        </p>
                        <textarea
                            className="form-control"
                            id="exampleTextarea"
                            rows="3"
                        >
                            {popupData[1]}
                        </textarea>
                    </div>
                </div>
            );
        } else if (popupData[0] === "gas") {
            return (
                <div className="modal-container">
                    <div className="alert alert-dismissible alert-warning">
                        <button
                            type="button"
                            className="btn-close"
                            onClick={hidePopup}
                        ></button>
                        <strong>Warning!</strong>
                        <p className="text-dark">
                            Gas fee problem is partially resolved, it will give
                            you reasonable price which is under 200$. But
                            consider that it's statically adjuted (current
                            default is 285000 limit). We are working to develop
                            gas management strategy and offer the best prices,
                            this will be available in next patch (v0.0.3)
                        </p>
                    </div>
                </div>
            );
        } else if (popupData[0] === "metamask") {
            return (
                <div className="modal-container">
                    <div className="alert alert-dismissible alert-warning">
                        <button
                            type="button"
                            className="btn-close"
                            onClick={hidePopup}
                        ></button>
                        <strong>Warning!</strong>
                        <p className="text-dark">
                            Please connect metamask with the button in the top
                            right corner
                        </p>
                    </div>
                </div>
            );
        } else {
            return <p>THIS IS A TEST</p>;
        }
    };

    return (
        <div>
            {errorController()}
            <div className="row">
                <div className="col-lg-12 form-tabbed">
                    <div className="form-group text-center">
                        <label htmlFor="exampleInputEmail1">
                            <img
                                src="images/welcome.gif"
                                className="welcome-gif"
                                alt="Welcome to the minting section"
                            />

                            <h1>
                                <u>Minting</u>
                            </h1>
                        </label>
                        <div className="row">
                            <div className="col-md-5 text-center">
                                <div className="input-group mb-3">
                                    {checkValue()}
                                    <input
                                        type="number"
                                        className="form-control number-custom"
                                        id="exampleInputEmail1"
                                        min="1"
                                        max="20"
                                        placeholder=""
                                        value={ethPrice}
                                        onChange={(event) => {
                                            setEthPrice(event.target.value);
                                            setAmount(event.target.value);
                                        }}
                                    />
                                    <span className="input-group-text">
                                        NFT
                                    </span>
                                </div>
                            </div>

                            <div className="col-sm-2 text-center">
                                <h1 className="equals">=</h1>
                            </div>

                            <div className="col-md-5 text-center">
                                <div className="input-group mb-3">
                                    <input
                                        type="number"
                                        className="form-control eth-custom"
                                        id="exampleInputEmail1"
                                        min="1"
                                        max="20"
                                        placeholder=""
                                        disabled
                                        value={ethPrice * 0.06}
                                    />
                                    <span className="input-group-text">
                                        ETH
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p>
                            <small>(Maximum of 20)</small> <br />
                        </p>
                        <br />
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={buyToken}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default MintForm;
