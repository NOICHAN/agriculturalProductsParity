const rounded = document.querySelector('.rounded-end')
const searchBtn = document.querySelector('.search')
const showList = document.querySelector('.showList')
const showResult = document.querySelector('.show-result')
const type = document.querySelector('.button-group')
const advanced = document.querySelector('.js-sort-advanced')
const select = document.querySelector('.sort-select')
let data = []
let newData = []

axios.get('https://hexschool.github.io/js-filter-data/data.json')
    .then(function (response) {
        data = response.data
    })

function showItem(item) {
    return `<tr>
        <td>${item.作物名稱}</td>
        <td>${item.市場名稱}</td>
        <td>${item.上價}</td>
        <td>${item.中價}</td>
        <td>${item.下價}</td>
        <td>${item.平均價}</td>
        <td>${item.交易量}</td>
    </tr>`
}

function dataItem() {
    let str = ''
    if (newData.length === 0) {
        str = `<tr><td colspan="6" class="text-center p-3">查無資料，請重新輸入並搜尋想比價的作物名稱^＿^</td></tr>`
    }
    newData.forEach(function (item) {
        str += showItem(item)
    })
    showList.innerHTML = str
}

searchBtn.addEventListener('click', function (e) {
    if (rounded.value === '') {
        alert('欄位不可為空白')
        return;
    } else {
        newData = data.filter(function (item) {
            if (item.作物名稱 === null) {
                return
            }
            return item.作物名稱.includes(rounded.value)
        })
        dataItem()
        showResult.textContent = `查看「${rounded.value}」的比價結果`
        rounded.value = ''
    }
})

type.addEventListener('click', function (e) {
    const codename = e.target.getAttribute('data-type')
    if (e.target.nodeName === 'BUTTON') {
        newData = data.filter(function (item) {
            if (item.種類代碼 === null) {
                return
            }
            return item.種類代碼 === codename
        })
        dataItem()
        showResult.textContent = `查看「${e.target.textContent}」的比價結果`
    }
})

advanced.addEventListener('click', function (e) {
    if (e.target.nodeName !== 'I') {
        return
    }
    const price = e.target.getAttribute('data-price')
    const dataSort = e.target.getAttribute('data-sort')
    flipList(price, dataSort)

})

function flipList(price, dataSort) {
    let t;
    if (newData.length === 0) {
        return
    } else if (dataSort === 'up') {
        for (let i = 0; i < newData.length; i++) {
            for (let j = 0; j < newData.length - i - 1; j++) {
                if (newData[j][price] > newData[j + 1][price]) {
                    t = newData[j]
                    newData[j] = newData[j + 1]
                    newData[j + 1] = t
                }
            }
        }
    } else if (dataSort === 'down') {
        for (let i = 0; i < newData.length; i++) {
            for (let j = 0; j < newData.length - i - 1; j++) {
                if (newData[j][price] < newData[j + 1][price]) {
                    t = newData[j]
                    newData[j] = newData[j + 1]
                    newData[j + 1] = t
                }
            }
        }
    }
    dataItem()
}

select.addEventListener('change', function (e) {
    let sort = ''
    switch (e.target.value) {
        case '依上價排序':
            sort = '上價'
            break

        case '依中價排序':
            sort = '中價'
            break

        case '依下價排序':
            sort = '下價'
            break

        case '依平均價排序':
            sort = '平均價'
            break

        case '依交易量排序':
            sort = '交易量'
            break
    }
    if (newData.length === 0) {
        return
    }
    for (let i = 0; i < newData.length; i++) {
        for (let j = 0; j < newData.length - i - 1; j++) {
            if (newData[j][sort] > newData[j + 1][sort]) {
                t = newData[j]
                newData[j] = newData[j + 1]
                newData[j + 1] = t
            }
        }
    }
    dataItem()
})