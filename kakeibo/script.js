let productCount = 0;

document.getElementById('add-product-btn').addEventListener('click', function() {
    productCount++;

    // 商品名、税抜価格、税率を格納するための要素を作成
    const productItem = document.createElement('div');
    productItem.className = 'product-item';
    productItem.innerHTML = `
        <input type="text" class="product-name" placeholder="商品名" required />
        <input type="number" class="product-price" placeholder="税抜価格" min="0" required />
        <select class="tax-rate">
            <option value="8">8%</option>
            <option value="10">10%</option>
        </select>
        <p class="tax-price">税込: ¥0</p>
        <p class="tax-price-with-correction"> 修正後: ¥0</p>
    `;

    // 商品リストに商品を追加
    document.querySelector('.product-list').appendChild(productItem);

    // 修正金額対象商品のセレクトボックスに商品名を追加
    const productNameInput = productItem.querySelector('.product-name');
    const correctionProductSelect = document.getElementById('correction-product');

    // 商品名が空でない場合、セレクトボックスにオプションを追加
    const option = document.createElement('option');
    option.value = `商品 ${productCount}`;
    option.textContent = `商品 ${productCount}`;
    correctionProductSelect.appendChild(option);

    // 商品名の入力が変更されたら修正金額対象商品セレクトボックスを更新
    productNameInput.addEventListener('input', function() {
        option.textContent = productNameInput.value || `商品 ${productCount}`;
    });

    // 商品の税抜価格が変更された時に税込価格を計算するための処理
    const productPriceInput = productItem.querySelector('.product-price');
    const taxRateSelect = productItem.querySelector('.tax-rate');
    const taxPriceDisplay = productItem.querySelector('.tax-price');
    const taxPriceWithCorrectionDisplay = productItem.querySelector('.tax-price-with-correction');

    productPriceInput.addEventListener('input', function() {
        const taxPrice = calculateTaxPrice(productPriceInput, taxRateSelect, taxPriceDisplay);
        calculateTotal();
        taxPriceWithCorrectionDisplay.textContent = ` 修正後: ¥${taxPrice}`;
    });

    // 税率変更時に税込価格を再計算
    taxRateSelect.addEventListener('change', function() {
        const taxPrice = calculateTaxPrice(productPriceInput, taxRateSelect, taxPriceDisplay);
        calculateTotal();
        taxPriceWithCorrectionDisplay.textContent = ` 修正後: ¥${taxPrice}`;
    });
});

// 税込価格を計算する関数
function calculateTaxPrice(priceInput, taxRateSelect, taxPriceDisplay) {
    const price = parseInt(priceInput.value) || 0;
    const taxRate = parseFloat(taxRateSelect.value) / 100;
    const taxPrice = Math.floor(price * (1 + taxRate)); // 小数点以下切り捨て
    taxPriceDisplay.textContent = `税込: ¥${taxPrice}`;
    return taxPrice;
}

// 合計金額の計算関数
function calculateTotal() {
    let total = 0;
    const productItems = document.querySelectorAll('.product-item');

    productItems.forEach(item => {
        const taxPriceDisplay = item.querySelector('.tax-price').textContent;
        const taxPriceMatch = taxPriceDisplay.match(/[\d,]+/); // ¥を取り除いた正規表現に変更
        if (taxPriceMatch) {
            total += parseInt(taxPriceMatch[0].replace(/,/g, '')); // 税込価格を合計
        }
    });

    const correctionAmount = parseFloat(document.getElementById('correction-amount').value) || 0;
    const totalWithCorrection = total + correctionAmount;

    document.getElementById('total-price').textContent = `合計金額: ¥${total}`;
    document.getElementById('total-with-correction').textContent = `修正後金額: ¥${totalWithCorrection}`;

    // 修正金額を各商品の税込価格に反映
    const correctionProductSelect = document.getElementById('correction-product');
    const selectedProductIndex = correctionProductSelect.selectedIndex - 1; // 最初の選択肢を除くため -1
    if (selectedProductIndex >= 0) {
        const selectedItem = productItems[selectedProductIndex];
        const taxPriceDisplay = selectedItem.querySelector('.tax-price').textContent;
        const taxPriceMatch = taxPriceDisplay.match(/[\d,]+/); // ¥を取り除いた正規表現に変更
        if (taxPriceMatch) {
            const originalTaxPrice = parseInt(taxPriceMatch[0].replace(/,/g, '')); // 元の税込価格
            const newTaxPrice = originalTaxPrice + correctionAmount; // 修正後の税込価格
            selectedItem.querySelector('.tax-price-with-correction').textContent = `修正後: ¥${newTaxPrice}`;
        }
    }
}

// 修正金額の変更時の処理
document.getElementById('correction-amount').addEventListener('input', calculateTotal);
document.getElementById('correction-product').addEventListener('change', calculateTotal);