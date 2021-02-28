class SudokuSolver {
    constructor(sudoku) {
        this.sudoku = sudoku;
    }

    nakedSingle() {
        return this.sudoku.cells
            .filter(cell => !cell.given && !cell.guessed)
            .filter(cell => cell.candidates.filter(e => e).length === 1)
            .map(cell => ({technique: "naked single", cell}));
    }

    hiddenSingle() {
        const ans = [];
        for (const form of ["r", "c", "b"]) {
            this.sudoku[form].forEach((house, idx) => {
                for (let num = 1; num <= 9; ++num) {
                    const cand = house.filter(cell => !cell.given && !cell.guessed)
                        .filter(cell => cell.candidates[num]);
                    if (cand.length === 1) ans.push({
                        technique: "hidden single",
                        num,
                        house: form + idx,
                        cell: cand[0],
                    });
                }
            });
        }
        return ans;
    }

    fish(size) {
        for (const baseHouse of ["r", "c"]) {
            const coverHouse = baseHouse === "r" ? "c" : "r";
            for (let num = 1; num <= 9; ++num) {
                const baseCandidate = [];
                this.sudoku[baseHouse].forEach((house, idx) => {
                    const tmp = house.filter(cell => !cell.given && !cell.guessed)
                        .filter(cell => cell.candidates[num]);
                    if (tmp.length == size) baseCandidate.push(tmp);
                });
                console.log(baseHouse, num, baseCandidate.map(base => base.map(cell => cell[coverHouse])));
                while (baseCandidate.length >= size) {
                    const base = [baseCandidate.shift()];
                    const coverIdx = base[0].map(cell => cell[coverHouse]);
                    for (const cand of baseCandidate) {
                        if (cand.every(cell => coverIdx.every(idx => cell.candidates[idx]))) base.push(cand);
                    }
                    // console.log(num, base);
                }
            }
        }
    }
}
