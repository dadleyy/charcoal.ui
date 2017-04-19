
module.exports = [{
  params: {width: 100, height: 200, columns: 10},
  inserts: [
    {rowspan: 1, colspan: 1},
    {rowspan: 2, colspan: 1}
  ],
  expects: [
    {width: 10, height: 10, left: 0, top: 0},
    {width: 10, height: 20, left: 10, top: 0}
  ]
}, {
  params: {width: 10, height: 10, columns: 10},
  inserts: [
    {rowspan: 1, colspan: 1},
    {rowspan: 2, colspan: 9},
    {rowspan: 1, colspan: 1},
    {rowspan: 1, colspan: 1}
  ],
  expects: [
    {width: 1, height: 1, left: 0, top: 0},
    {width: 9, height: 2, left: 1, top: 0},
    {width: 1, height: 1, left: 0, top: 1},
    {width: 1, height: 1, left: 0, top: 2}
  ]
}];
