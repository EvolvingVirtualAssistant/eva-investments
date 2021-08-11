function explore_this_idea() {
  // input -> buyP, sellP, P1
  // vars  -> buyQ, sellQ, Q2
  // buyQ, sellQ, Q2
  const sol1 = gauss([
    [14.33, 0, -1, 0], // buyP*buyQ + 0*sellQ -1*Q2 = 0
    [0, 14.80518, -1, 0], // 0*buyQ + sellP*sellF*sellQ -1*Q2 = 0
    [0.999, -1, 0, 0.2], // buyF*buyQ -1*sellQ -1*Q2 = P1
  ]);
  // [buyP, 0, -1 | 0]
  // [0, sellP*sellF, -1 | 0]
  // [buyF, -1, -1 | 0]
  console.log(sol1);

  // input -> buyQ, sellQ, Q2
  // vars  -> buyP, sellP, P1
  // buyP, sellP, P1
  const sol2 = gauss([
    [6.431793989080453, 0, 0, 92.16760786352289], // buyQ*buyP + 0*sellP + 0*P1 = Q2
    [0, 6.219136832896281627, 0, 92.16760786352289], // 0*buyP + sellF*sellQ*sellP + 0*P1 = Q2
    [0, 0, 1, 0.199999999999999547], // 0*buyP + 0*sellP + 1*P1 = P1
  ]);
  // [buyQ, 0, 0 | Q2]
  // [0, sellQ*sellF, 0 | Q2]
  // [0, 0, 1 | P1]
  console.log(sol2);

  // - Calculate from a set of equations, which only contain variables
  // that we are interested in knowing, all their linear form possibilities
  // - Then create matrices, with each row representing one of the linear forms
  // of each equation, basically combining all possible linear forms of one equation
  // with all other equations
  // e.g., x*y = z => 0*x + a*y + -1*z = 0 , a=x, b=-1, c=-1, d=0
  //                  a*x + 0*y + -1*z = 0 , a=y, b=-1, c=-1, d=0
  //                  0*x + -1*y + a*z = 0 , a=1/x, b=-1, c=-1, d=0
  //                  -1*x + 0*y + a*z = 0 , a=1/y, b=-1, c=-1, d=0
  //                  a*(1/x) + -1*y + 0*z = 0 , x'=1/x<=>x=1/x', a=z, b=-1, c=-1, d=0
  //                  -1*x + a*(1/y) + 0*z = 0 , y'=1/y<=>y=1/y', a=z, b=-1, c=-1, d=0
}

// Taken from here https://martin-thoma.com/solving-linear-equations-with-gaussian-elimination/
/** Solve a linear system of equations given by a n&times;n matrix
    with a result vector n&times;1. */
export function gauss(A: number[][]): number[] {
  var n = A.length;

  for (var i = 0; i < n; i++) {
    // Search for maximum in this column
    var maxEl = Math.abs(A[i][i]);
    var maxRow = i;
    for (var k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > maxEl) {
        maxEl = Math.abs(A[k][i]);
        maxRow = k;
      }
    }

    // Swap maximum row with current row (column by column)
    for (var k = i; k < n + 1; k++) {
      var tmp = A[maxRow][k];
      A[maxRow][k] = A[i][k];
      A[i][k] = tmp;
    }

    // Make all rows below this one 0 in current column
    for (k = i + 1; k < n; k++) {
      var c = -A[k][i] / A[i][i];
      for (var j = i; j < n + 1; j++) {
        if (i == j) {
          A[k][j] = 0;
        } else {
          A[k][j] += c * A[i][j];
        }
      }
    }
  }

  // Solve equation Ax=b for an upper triangular matrix A
  var x = new Array(n);
  for (var i = n - 1; i > -1; i--) {
    x[i] = A[i][n] / A[i][i];
    for (var k = i - 1; k > -1; k--) {
      A[k][n] -= A[k][i] * x[i];
    }
  }
  return x;
}
