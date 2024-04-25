import DaumPostcode from "react-daum-postcode";

export default function DaumAddressWindow() {
    return (
        <DaumPostcode
            onComplete={(addr) => {
                window.opener.document.getElementById("post-code-elem").value =
                    addr.zonecode;
                window.opener.document.getElementById("address-elem").value =
                    addr.address;
                window.close();
            }}
        />
    );
}
