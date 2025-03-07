import { toBigNumber } from "@rarible/types"
import { useState } from "react"
import { EthEthereumAssetType } from "@rarible/api-client/build/models/AssetType"
import { Input } from "../common/input"
import { FormProps } from "../common/form-props"
import { OrderRequest, PrepareOrderResponse } from "@rarible/sdk/build/order/common"

type SellFormProps = FormProps<OrderRequest> & {
	response: PrepareOrderResponse
}

const ethCurrency: EthEthereumAssetType = {
	"@type": "ETH",
}

export function OrderForm({ onSubmit, response }: SellFormProps) {
	const [price, setPrice] = useState<string>("")
	const [amount, setAmount] = useState<string>("")
	const error = validate(price, amount, response)

	return (
		<div>
			<div>
				<Input value={price} onChange={setPrice} placeholder="Price"/>
			</div>
			<div>
				<Input value={amount} onChange={setAmount} placeholder="Amount"/>
			</div>
			<button
				onClick={() => onSubmit({ amount: parseInt(amount), price: toBigNumber(price), currency: ethCurrency })}
				disabled={error !== undefined}
			>Submit</button>
			{error && <p style={{ color: "red" }}>{error}</p>}
		</div>
	)
}

function validate(price: string, amount: string, prepareResponse: PrepareOrderResponse): string | undefined {
	const p = parseFloat(price)
	if (isNaN(p)) {
		return "price can not be parsed"
	}
	const a = parseInt(amount)
	if (isNaN(a)) {
		return "amount can not be parsed"
	}
	//todo should this be number?
	if (a > parseInt(prepareResponse.maxAmount)) {
		return `max amount: ${prepareResponse.maxAmount}`
	}
	return undefined
}
