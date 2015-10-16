/// <reference path="ramda.d.ts" />

var double = function(x: number): number {
    return x + x
};
var shout = function(x: number): string {
    return x >= 10
        ? 'big'
        : 'small'
};

class F {
    x = 'X';
    y = 'Y';
}
class F2 {
    a = 100;
    y = 1;
    x(){};
    z() {};
}
(() => {
    /* op */
    var div: Function;
    div = R.op(function (a, b) {
        return a / b;
    });
});

(() => {
    var x: boolean;
    x = R.isArrayLike('a');
    x = R.isArrayLike([1,2,3]);
    x = R.isArrayLike([]);
});

() => {
    var takesNoArg = function() { return true; };
    var takesOneArg = function(a: number) { return [a]; };
    var takesTwoArgs = function(a: number, b: number) { return [a, b]; };
    var takesThreeArgs = function(a: number, b: number, c: number) { return [a, b, c]; };

    var addFourNumbers = function(a: number, b: number, c: number, d: number): number {
      return a + b + c + d;
    };

    var x1: Function = R.curry(addFourNumbers)
    // because of the current way of currying, the following call results in a type error
    // var x2: Function = R.curry(addFourNumbers)(1,2,4)
    var x3: Function = R.curry(addFourNumbers)(1)(2)
    var x4: Function = R.curry(addFourNumbers)(1)(2)(3)
    var y1: number = R.curry(addFourNumbers)(1)(2)(3)(4)

    R.nAry(0, takesNoArg);
    R.nAry(0, takesOneArg);
    R.nAry(1, takesTwoArgs);
    R.nAry(1, takesThreeArgs);

    var u1: {(a: any): any} = R.unary(takesOneArg);
    var u2: {(a: any): any} = R.unary(takesTwoArgs);
    var u3: {(a: any): any} = R.unary(takesThreeArgs);

    R.binary(takesTwoArgs);
    R.binary(takesThreeArgs);

}

/* compose */
() => {
    var double = function(x: number): number {
        return x + x
    }
    var limit10 = function(x: number): boolean {
        return x >= 10
    }
    var func: (x: number) => boolean = R.compose(limit10, double)
    var res: boolean = R.compose(limit10, double)(10)

    const f0 = (s: string) => +s;      // string -> number
    const f1 = (n: number) => n === 1; // number -> boolean
    const f2 = R.compose(f1, f0);      // string -> boolean

    // akward example that bounces types between number and string
    const g0 = (list: number[]) => R.map(R.inc, list);
    const g1 = R.dropWhile(R.gt(10));
    const g2 = R.map((i: number) => i > 5 ? 'bigger' : 'smaller');
    const g3 = R.all((i: string) => i === 'smaller');
    const g = R.compose(g3, g2, g1, g0);
    const g_res: boolean = g([1, 2, 10, 13]);
}

/* pipe */
() => {
    var func: (x: number) => string = R.pipe(double, double, shout)
    var res: string = R.pipe(double, double, shout)(10);

    const capitalize = (str: string) => R.pipe(
        R.split(''),
        R.adjust(R.toUpper, 0),
        R.join('')
    )(str);

    var f = R.pipe(Math.pow, R.negate, R.inc);
    var fr: number = f(3, 4); // -(3^4) + 1

    var name = R.pipe(
        R.split(''),
        R.map(letter => [letter])
    )("dave");

    const b = R.pipe(
        R.prop('name'),
        R.length
    )({ name: 'dave' });

    const p = R.map(x => x)(['a','b'])
}

R.invoker('charAt', String.prototype);
R.invoker('charAt', String.prototype, 1);

var square = function(x: number) { return x * x; };
var add = function(a: number, b: number) { return a + b; };
// Adds any number of arguments together
var addAll = function() {
  return 0;
};

// Basic example
R.useWith(addAll, double, square);

(() => {
  var printXPlusFive = function(x: number) { console.log(x + 5); };
  R.forEach(printXPlusFive, [1, 2, 3]);
  R.clone([{},{},{}])
  R.clone([1,2,3]);
})();

// (() => {
//   var printXPlusFive = function(x, i) { console.log(i + 5); };
//   R.forEach.idx(printXPlusFive, [{name: 1}, {name: 2}, {name: 3}]);
// })();

var i = function(x: number) {return x;};
R.times(i, 5);

(() => {
  var triple = function(x: number): number { return x * 3; };
  var square = function(x: number): number { return x * x; };
  var squareThenDoubleThenTriple = R.pipe(square, double, triple);
  squareThenDoubleThenTriple(5); //=> 150


})();

(() => {
    var multiply = function(a: number, b: number) { return a * b; };
    var double = R.partial(multiply, 2);
    double(2); //=> 4

    var greet = function(salutation: string, title: string, firstName: string, lastName: string) {
      return salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
    };
    var sayHello = R.partial(greet, 'Hello');
    var sayHelloToMs = R.partial(sayHello, 'Ms.');
    sayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'

    var greetMsJaneJones = R.partialRight(greet, 'Ms.', 'Jane', 'Jones');
    greetMsJaneJones('Hello'); //=> 'Hello, Ms. Jane Jones!'
})();

(() => {
    var numberOfCalls = 0;
    var trackedAdd = function(a: number, b: number) {
      numberOfCalls += 1;
      return a + b;
    };
    var memoTrackedAdd = R.memoize(trackedAdd);

    memoTrackedAdd(1, 2); //=> 3
    numberOfCalls; //=> 1
    memoTrackedAdd(1, 2); //=> 3
    numberOfCalls; //=> 1
    memoTrackedAdd(2, 3); //=> 5
    numberOfCalls; //=> 2

    // Note that argument order matters
    memoTrackedAdd(2, 1); //=> 3
    numberOfCalls; //=> 3
})();

(() => {
    var addOneOnce = R.once(function(x: number){ return x + 1; });
    addOneOnce(10); //=> 11
    addOneOnce(addOneOnce(50)); //=> 11
})();

(() => {
    var slashify = R.wrap(R.flip(R.add)('/'), function(f: Function, x: string) {
      return R.match(/\/$/, x) ? x : f(x);
    });

    slashify('a');  //=> 'a/'
    slashify('a/'); //=> 'a/'
})();



(() => {
    var numbers = [1, 2, 3];
    var add = function(a: number, b: number) {
        return a + b
    };
    R.reduce(add, 10, numbers); //=> 16;
})();
(() => {
    var plus3 = R.add(3);
})();
(() => {
    var pairs = [ ['a', 1], ['b', 2], ['c', 3] ];
    var flattenPairs = function(acc: [string, number], pair: [string, number]) {
      return acc.concat(pair);
    };
    R.reduceRight(flattenPairs, [], pairs); //=> [ 'c', 3, 'b', 2, 'a', 1 ]
})();
(() => {
    var values = { x: 1, y: 2, z: 3 };
    var double = function(num: number) {
      return num * 2;
    };

    R.mapObj(double, values); //=> { x: 2, y: 4, z: 6 }
});
(() => {
    var values = { x: 1, y: 2, z: 3 };
    var prependKeyAndDouble = function(num: number, key: string, obj: any) {
        return key + (num * 2);
    };
    R.mapObjIndexed(prependKeyAndDouble, values); //=> { x: 'x2', y: 'y4', z: 'z6' }
});
(() => {
    R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
    R.of([1]); //=> [[1]]
    R.empty([1,2,3,4,5]); //=> []
});

(() => {
    R.length([1, 2, 3]); //=> 3
});

(() => {
    var isEven = function(n: number) {
        return n % 2 === 0;
    };
    R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]

    var lastTwo = function(val: number, idx: number, list: number[]) {
      return list.length - idx <= 2;
    };
    R.filterIndexed(lastTwo, [8, 6, 7, 5, 3, 0, 9]); //=> [0, 9]

    var isOdd = function(n: number) {
      return n % 2 === 1;
    };
    R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
});
(() => {
    var isNotFour = function(x: number) {
      return !(x === 4);
    };
    R.takeWhile(isNotFour, [1, 2, 3, 4]); //=> [1, 2, 3]
    R.take(2, [1, 2, 3, 4]); //=> [1, 2]
});
(() => {
    var f = function(n: number) { return n > 50 ? false : [-n, n + 10] };
    R.unfold(f, 10); //=> [-10, -20, -30, -40, -50]
});
/*****************************************************************
 * Function category
 */


 () => {
     var mergeThree = function(a: number, b: number, c: number): number[] {
       return ([]).concat(a, b, c);
     };
     mergeThree(1, 2, 3); //=> [1, 2, 3]
     var flipped = R.flip(mergeThree);
     flipped(1, 2, 3); //=> [2, 1, 3]
 }

/*********************
 * List category
 ********************/
() => {
    var lessThan2 = R.flip(R.lt)(2);
    var lessThan3 = R.flip(R.lt)(3);
    R.all(lessThan2)([1, 2]); //=> false
    R.all(lessThan3)([1, 2]); //=> true
}

() => {
    R.allUniq(['1', 1]); //=> true
    R.allUniq([1, 1]);   //=> false
    R.allUniq([[42], [42]]); //=> false
}

() => {
    var lessThan0 = R.flip(R.lt)(0);
    var lessThan2 = R.flip(R.lt)(2);
    R.any(lessThan0)([1, 2]); //=> false
    R.any(lessThan2)([1, 2]); //=> true
}

() => {
    R.aperture(2, [1, 2, 3, 4, 5]); //=> [[1, 2], [2, 3], [3, 4], [4, 5]]
    R.aperture(3, [1, 2, 3, 4, 5]); //=> [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
    R.aperture(7, [1, 2, 3, 4, 5]); //=> []
    R.aperture(7)([1, 2, 3, 4, 5]); //=> []
}

() => {
    R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
    R.append('tests', []); //=> ['tests']
    R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
    R.append(['tests'])(['write', 'more']); //=> ['write', 'more', ['tests']]
}

() => {
    var duplicate = function(n: number) {
        return [n, n];
    };
    R.chain(duplicate, [1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]
    R.chain(duplicate)([1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]
}

() => {
    var as = [[1], [3, 4]];
    R.commute(R.of, as); //=> [[1, 3], [1, 4]]

    var bs = [[1, 2], [3]];
    R.commute(R.of, bs); //=> [[1, 3], [2, 3]]

    var cs = [[1, 2], [3, 4]];
    R.commute(R.of, cs); //=> [[1, 3], [2, 3], [1, 4], [2, 4]]
    R.commute(R.of)(cs); //=> [[1, 3], [2, 3], [1, 4], [2, 4]]
}

() => {
    var plus10map = R.map(function(x: number) { return x + 10; });
    var as = [[1], [3, 4]];
    R.commuteMap(R.map(function(x: number) { return x + 10; }), R.of, as); //=> [[11, 13], [11, 14]]

    var bs = [[1, 2], [3]];
    R.commuteMap(plus10map, R.of, bs); //=> [[11, 13], [12, 13]]

    var cs = [[1, 2], [3, 4]];
    R.commuteMap(plus10map, R.of, cs); //=> [[11, 13], [12, 13], [11, 14], [12, 14]]
    R.commuteMap(plus10map)(R.of, cs); //=> [[11, 13], [12, 13], [11, 14], [12, 14]]
    R.commuteMap(plus10map, R.of)(cs); //=> [[11, 13], [12, 13], [11, 14], [12, 14]]
}

() => {
    R.concat([], []); //=> []
    R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
    R.concat([4, 5, 6])([1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
    R.concat('ABC')('DEF'); // 'ABCDEF'
}

() => {
    R.contains(3)([1, 2, 3]); //=> true
    R.contains(3, [1, 2, 3]); //=> true
    R.contains(4)([1, 2, 3]); //=> false
    R.contains({})([{}, {}]); //=> false
    var obj = {};
    R.contains(obj)([{}, obj, {}]); //=> true
}

() => {
    var xs = [{x: 12}, {x: 11}, {x: 10}];
    R.containsWith(function(a, b) { return a.x === b.x; }, {x: 10}, xs); //=> true
    R.containsWith(function(a, b) { return a.x === b.x; }, {x: 1}, xs); //=> false
    R.containsWith(function(a, b) { return a.x === b.x; }, {x: 1})(xs); //=> false
}

() => {
    R.drop(3, [1,2,3,4,5,6,7]); //=> [4,5,6,7]
    R.drop(3)([1,2,3,4,5,6,7]); //=> [4,5,6,7]
}

() => {
    R.dropLast(1, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
    R.dropLast(2, ['foo', 'bar', 'baz']); //=> ['foo']
    R.dropLast(3, ['foo', 'bar', 'baz']); //=> []
    R.dropLast(4)(['foo', 'bar', 'baz']); //=> []
    R.dropLast(3, 'ramda');               //=> 'ra'
    R.dropLast(3)('ramda');               //=> 'ra'
}

() => {
    var lteThree = (x: number) => x <= 3;
    R.dropLastWhile(lteThree, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3, 4]
    R.dropLastWhile(lteThree)([1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3, 4]
}

() => {
    R.dropRepeats([1, 1, 1, 2, 3, 4, 4, 2, 2]); //=> [1, 2, 3, 4, 2]
}

() => {
    var lengthEq = (x: number, y: number) => Math.abs(x) === Math.abs(y);
    var l = [1, -1, 1, 3, 4, -4, -4, -5, 5, 3, 3];
    R.dropRepeatsWith(R.eqBy(Math.abs), l); //=> [1, 3, 4, -5, 3]
}

() => {
    var lteTwo = function(x: number) {
        return x <= 2;
    };
    R.dropWhile(lteTwo, [1, 2, 3, 4]); //=> [3, 4]
    R.dropWhile(lteTwo)([1, 2, 3, 4]); //=> [3, 4]
}

() => {
    var isEven = function(n: number) {
        return n % 2 === 0;
    };
    R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
    var isEvenFn = R.filter(isEven);
    isEvenFn([1, 2, 3, 4]);
}

() => {
    var lastTwo = function(val: number, idx: number, list: number[]) {
        return list.length - idx <= 2;
    };
    R.filterIndexed(lastTwo, [8, 6, 7, 5, 3, 0, 9]); //=> [0, 9]
    var lastTwoFn = R.filterIndexed(lastTwo);
    lastTwoFn([8, 6, 7, 5, 3, 0, 9]);
}

() => {
    var xs = [{a: 1}, {a: 2}, {a: 3}];
    R.find(R.propEq('a', 2))(xs); //=> {a: 2}
    R.find(R.propEq('a', 4))(xs); //=> undefined
}

() => {
    var xs = [{a: 1}, {a: 2}, {a: 3}];
    R.findIndex(R.propEq('a', 2))(xs); //=> 1
    R.findIndex(R.propEq('a', 4))(xs); //=> -1

    R.findIndex((x) => x === 1, [1, 2, 3]);
}

() => {
    var xs = [{a: 1, b: 0}, {a:1, b: 1}];
    R.findLast(R.propEq('a', 1))(xs); //=> {a: 1, b: 1}
    R.findLast(R.propEq('a', 4))(xs); //=> undefined
}

() => {
    var xs = [{a: 1, b: 0}, {a:1, b: 1}];
    R.findLastIndex(R.propEq('a', 1))(xs); //=> 1
    R.findLastIndex(R.propEq('a', 4))(xs); //=> -1
    R.findLastIndex((x) => x === 1, [1, 2, 3]);
}
() => {
    var user1 = { address: { zipCode: 90210 } };
    var user2 = { address: { zipCode: 55555 } };
    var user3 = { name: 'Bob' };
    var users = [ user1, user2, user3 ];
    var isFamous = R.pathEq(['address', 'zipCode'], 90210);
    R.filter(isFamous, users); //=> [ user1 ]
}
() => {
    var xs: {[key:string]: string} = {a: '1', b: '0'};
    R.propEq('a', '1', xs);//=> true
    R.propEq('a', '4', xs); //=> false
}
() => {
    var xs: {[key:string]: number} = {a: 1, b: 0};
    R.propEq('a', 1, xs);//=> true
    R.propEq('a', 4, xs); //=> false
}
() => {
    var xs = {a: '1', b: '0'};
    R.propEq('a', '1', xs);//=> true
    R.propEq('a', '4', xs); //=> false
}
() => {
    var xs = {a: 1, b: 0};
    R.propEq('a', 1, xs);//=> true
    R.propEq('a', 4, xs); //=> false
}

interface Obj { a: number; b: number };
() => {
    var xs: Obj = {a: 1, b: 0};
    R.propEq('a', 1, xs);//=> true
    R.propEq('a', 4, xs); //=> false
}

() => {
    R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
    //=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}

() => {
    var printXPlusFive = function(x: number) { console.log(x + 5); };
    R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
    R.forEach(printXPlusFive)([1, 2, 3]); //=> [1, 2, 3]
    //-> 6
    //-> 7
    //-> 8
}

() => {
    var plusFive = function(num: number, idx: number, list: number[]) { list[idx] = num + 5 };
    R.forEachIndexed(plusFive)([1, 2, 3]); //=> [6, 7, 8]
}

() => {
    R.fromPairs([['a', 1], ['b', 2],  ['c', 3]]); //=> {a: 1, b: 2, c: 3}
}

() => {
    var byGrade = R.groupBy(function(student: {score: number; name: string}) {
        var score = student.score;
        return score < 65 ? 'F' :
        score < 70 ? 'D' :
        score < 80 ? 'C' :
        score < 90 ? 'B' : 'A';
    });
    var students = [{name: 'Abby', score: 84},
    {name: 'Eddy', score: 58},
    {name: 'Jack', score: 69}];
    byGrade(students);
}

() => {
    R.head(['fi', 'fo', 'fum']); //=> 'fi'
    R.head([10, 'ten']); // => 10
    R.head(['10', 10]); // => '10'
}

() => {
    R.indexOf(3, [1,2,3,4]); //=> 2
    R.indexOf(10)([1,2,3,4]); //=> -1
}

() => {
    R.init(['fi', 'fo', 'fum']); //=> ['fi', 'fo']
}

() => {
    R.insert(2, 'x', [1,2,3,4]); //=> [1,2,'x',3,4]
    R.insert(2)('x', [1,2,3,4]); //=> [1,2,'x',3,4]
    R.insert(2, 'x')([1,2,3,4]); //=> [1,2,'x',3,4]
}

() => {
    R.insertAll(2, ['x','y','z'], [1,2,3,4]); //=> [1,2,'x','y','z',3,4]
    R.insertAll(2)(['x','y','z'], [1,2,3,4]); //=> [1,2,'x','y','z',3,4]
    R.insertAll(2, ['x','y','z'])([1,2,3,4]); //=> [1,2,'x','y','z',3,4]
}

() => {
    var numbers = [1, 2, 3, 4];
    var transducer = R.compose(R.map(R.add(1)), R.take(2));

    R.into([], transducer, numbers); //=> [2, 3]

    var intoArray = R.into([]);
    intoArray(transducer, numbers); //=> [2, 3]
}

() => {
    R.isSet(['1', 1]); //=> true
    R.isSet([1, 1]);   //=> false
    R.isSet([{}, {}]); //=> true
}

() => {
    var spacer = R.join(' ');
    spacer(['a', 2, 3.4]);   //=> 'a 2 3.4'
    R.join('|', [1, 2, 3]);    //=> '1|2|3'
}

() => {
    R.last(['fi', 'fo', 'fum']); //=> 'fum'
}

() => {
    R.lastIndexOf(3, [-1,3,3,0,1,2,3,4]); //=> 6
    R.lastIndexOf(10, [1,2,3,4]); //=> -1
}

() => {
    R.length([]); //=> 0
    R.length([1, 2, 3]); //=> 3
}

() => {
    var headLens = R.lensIndex(0);
    headLens([10, 20, 30, 40]); //=> 10
    headLens.set('mu', [10, 20, 30, 40]); //=> ['mu', 20, 30, 40]
    R.view(headLens, ['a', 'b', 'c']);            //=> 'a'
    R.set(headLens, 'x', ['a', 'b', 'c']);        //=> ['x', 'b', 'c']
    R.over(headLens, R.toUpper, ['a', 'b', 'c']); //=> ['A', 'b', 'c']
}

() => {
    var double = function(x: number) {
        return x * 2;
    };
    R.map(double, [1, 2, 3]); //=> [2, 4, 6]
}

() => {
    var digits = ['1', '2', '3', '4'];
    var append = function(a: string, b: string): [string, string]{
        return [a + b, a + b];
    }
    R.mapAccum(append, '0', digits); //=> ['01234', ['01', '012', '0123', '01234']]
    R.mapAccum(append)('0', digits); //=> ['01234', ['01', '012', '0123', '01234']]
    R.mapAccum(append, '0')(digits); //=> ['01234', ['01', '012', '0123', '01234']]
}

() => {
    var digits = ['1', '2', '3', '4'];
    var append = function(a: string, b: string): [string, string] {
        return [a + b, a + b];
    }

    R.mapAccumRight(append, '0', digits); //=> ['04321', ['04321', '0432', '043', '04']]
    R.mapAccumRight(append)('0', digits); //=> ['04321', ['04321', '0432', '043', '04']]
    R.mapAccumRight(append, '0')(digits); //=> ['04321', ['04321', '0432', '043', '04']]
}

() => {
    var squareEnds = function(elt: number, idx: number, list: number[]) {
        if (idx === 0 || idx === list.length - 1) {
            return elt * elt;
        }
        return elt;
    };
    R.mapIndexed(squareEnds, [8, 5, 3, 0, 9]); //=> [64, 5, 3, 0, 81]
    R.mapIndexed(squareEnds)([8, 5, 3, 0, 9]); //=> [64, 5, 3, 0, 81]
}

() => {
    R.mergeAll([{foo:1},{bar:2},{baz:3}]); //=> {foo:1,bar:2,baz:3}
    R.mergeAll([{foo:1},{foo:2},{bar:2}]); //=> {foo:2,bar:2}
}

() => {
    R.none(R.isNaN, [1, 2, 3]); //=> true
    R.none(R.isNaN, [1, 2, 3, NaN]); //=> false
    R.none(R.isNaN)([1, 2, 3, NaN]); //=> false
}

() => {
    var list = ['foo', 'bar', 'baz', 'quux'];
    R.nth(1, list); //=> 'bar'
    R.nth(-1, list); //=> 'quux'
    R.nth(-99, list); //=> undefined
    R.nth(-99)(list); //=> undefined
}

() => {
    R.partition(R.contains('s'), ['sss', 'ttt', 'foo', 'bars']);
    R.partition(R.contains('s'))(['sss', 'ttt', 'foo', 'bars']);
}

() => {
    R.pluck('a')([{a: 1}, {a: 2}]); //=> [1, 2]
    R.pluck(0)([[1, 2], [3, 4]]);   //=> [1, 3]
}

() => {
    R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
    R.prepend('fee')(['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
}

() => {
    R.range(1, 5);    //=> [1, 2, 3, 4]
    R.range(50)(53);  //=> [50, 51, 52]
}

() => {
    var numbers = [1, 2, 3];
    var add = function(a: number, b: number) {
        return a + b;
    };
    R.reduce(add, 10, numbers); //=> 16
    R.reduce(add)(10, numbers); //=> 16
    R.reduce(add, 10)(numbers); //=> 16
}

() => {
    var letters = ['a', 'b', 'c'];
    var objectify = function(accObject: {[elem:string]: number}, elem: string, idx: number, list: string[]) {
        accObject[elem] = idx;
        return accObject;
    };
    R.reduceIndexed(objectify, {}, letters); //=> { 'a': 0, 'b': 1, 'c': 2 }
    R.reduceIndexed(objectify)({}, letters); //=> { 'a': 0, 'b': 1, 'c': 2 }
    R.reduceIndexed(objectify, {})(letters); //=> { 'a': 0, 'b': 1, 'c': 2 }
}

type Pair = R.KeyValuePair<string, number>;
() => {
    var pairs: Pair[] = [ ['a', 1], ['b', 2], ['c', 3] ];
    var flattenPairs = function(acc: Pair[], pair: Pair): Pair[] {
        return acc.concat(pair);
    };
    R.reduceRight(flattenPairs, [], pairs); //=> [ 'c', 3, 'b', 2, 'a', 1 ]
    R.reduceRight(flattenPairs, [])(pairs); //=> [ 'c', 3, 'b', 2, 'a', 1 ]
    R.reduceRight(flattenPairs)([], pairs); //=> [ 'c', 3, 'b', 2, 'a', 1 ]
}

() => {
    var isOdd = function(n: number) {
        return n % 2 === 1;
    };
    R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
    R.reject(isOdd)([1, 2, 3, 4]); //=> [2, 4]
}

() => {
    var lastTwo = function(val: number, idx: number, list: number[]) {
        return list.length - idx <= 2;
    };
    R.rejectIndexed(lastTwo, [8, 6, 7, 5, 3, 0, 9]); //=> [8, 6, 7, 5, 3]
    R.rejectIndexed(lastTwo)([8, 6, 7, 5, 3, 0, 9]); //=> [8, 6, 7, 5, 3]
}

() => {
    R.remove(2, 3, [1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]
    R.remove(2, 3)([1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]
    R.remove(2)(3, [1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]
}

() => {
    R.repeat('hi', 5); //=> ['hi', 'hi', 'hi', 'hi', 'hi']
    var obj = {};
    var repeatedObjs = R.repeat(obj, 5); //=> [{}, {}, {}, {}, {}]
    repeatedObjs[0] === repeatedObjs[1]; //=> true
}

() => {
    R.reverse([1, 2, 3]);  //=> [3, 2, 1]
    R.reverse([1, 2]);     //=> [2, 1]
    R.reverse([1]);        //=> [1]
    R.reverse([]);         //=> []
}

() => {
    var numbers = [1, 2, 3, 4];
    R.scan(R.multiply, 1, numbers); //=> [1, 1, 2, 6, 24]
    R.scan(R.multiply, 1)(numbers); //=> [1, 1, 2, 6, 24]
    R.scan(R.multiply)(1, numbers); //=> [1, 1, 2, 6, 24]
}

() => {
    var xs = R.range(0, 10);
    R.slice(2, 5, xs); //=> [2, 3, 4]
    R.slice(2, 5)(xs); //=> [2, 3, 4]
    R.slice(2)(5, xs); //=> [2, 3, 4]

    var str = 'Hello World';
    R.slice(2, 5, str); //=> 'llo'
    R.slice(2, 5)(str); //=> 'llo'
    R.slice(2)(5, str); //=> 'llo'
}

() => {
    var diff = function(a: number, b: number) { return a - b; };
    R.sort(diff, [4,2,7,5]); //=> [2, 4, 5, 7]
    R.sort(diff)([4,2,7,5]); //=> [2, 4, 5, 7]
}

() => {
    R.tail(['fi', 'fo', 'fum']); //=> ['fo', 'fum']
    R.tail([1, 2, 3]); //=> [2, 3]
}

() => {
    R.take(3,[1,2,3,4,5]); //=> [1,2,3]

    var members= [ "Paul Desmond","Bob Bates","Joe Dodge","Ron Crotty","Lloyd Davis","Joe Morello","Norman Bates",
    "Eugene Wright","Gerry Mulligan","Jack Six","Alan Dawson","Darius Brubeck","Chris Brubeck",
    "Dan Brubeck","Bobby Militello","Michael Moore","Randy Jones"];
    var takeFive = R.take(5);
    takeFive(members); //=> ["Paul Desmond","Bob Bates","Joe Dodge","Ron Crotty","Lloyd Davis"]
}

() => {
    var isNotFour = function(x: number) {
        return !(x === 4);
    };

    R.takeWhile(isNotFour, [1, 2, 3, 4]); //=> [1, 2, 3]
    R.takeWhile(isNotFour)([1, 2, 3, 4]); //=> [1, 2, 3]
}

() => {
    R.times(R.identity, 5); //=> [0, 1, 2, 3, 4]
    R.times(R.identity)(5); //=> [0, 1, 2, 3, 4]
}

() => {
    var numbers = [1, 2, 3, 4];
    var transducer = R.compose(R.map(R.add(1)), R.take(2));
    var fn = R.flip<number, number[], number[]>(R.append);
    R.transduce(transducer, fn, [], numbers); //=> [2, 3]
    R.transduce(transducer, fn, [])(numbers); //=> [2, 3]
    R.transduce(transducer, fn)([], numbers); //=> [2, 3]
    R.transduce(transducer)(fn, [], numbers); //=> [2, 3]
}

() => {
    var f = function(n: number) { return n > 50 ? false : [-n, n + 10] };
    R.unfold(f, 10); //=> [-10, -20, -30, -40, -50]
    R.unfold(f)(10); //=> [-10, -20, -30, -40, -50]
}

() => {
    R.uniq([1, 1, 2, 1]); //=> [1, 2]
    R.uniq([{}, {}]);     //=> [{}, {}]
    R.uniq([1, '1']);     //=> [1, '1']
}

() => {
    var strEq = function(a: any, b: any) { return String(a) === String(b); };
    R.uniqWith(strEq, [1, '1', 2, 1]); //=> [1, 2]
    R.uniqWith(strEq)([1, '1', 2, 1]); //=> [1, 2]
    R.uniqWith(strEq)([{}, {}]);       //=> [{}]
    R.uniqWith(strEq)([1, '1', 1]);    //=> [1]
    R.uniqWith(strEq)(['1', 1, 1]);    //=> ['1']
}

() => {
    R.unnest([1, [2], [[3]]]); //=> [1, 2, [3]]
    R.unnest([[1, 2], [3, 4], [5, 6]]); //=> [1, 2, 3, 4, 5, 6]
}

() => {
    R.xprod([1, 2], ['a', 'b']); //=> [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
    R.xprod([1, 2])(['a', 'b']); //=> [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
}

() => {
    R.zip([1, 2, 3], ['a', 'b', 'c']); //=> [[1, 'a'], [2, 'b'], [3, 'c']]
    R.zip([1, 2, 3])(['a', 'b', 'c']); //=> [[1, 'a'], [2, 'b'], [3, 'c']]
}

() => {
    R.zipObj(['a', 'b', 'c'], [1, 2, 3]); //=> {a: 1, b: 2, c: 3}
    R.zipObj(['a', 'b', 'c'])([1, 2, 3]); //=> {a: 1, b: 2, c: 3}
}

() => {
    var f = function(x:number, y:string) {
        // ...
    };
    R.zipWith(f, [1, 2, 3], ['a', 'b', 'c']); //=> [f(1, 'a'), f(2, 'b'), f(3, 'c')]
    R.zipWith(f)([1, 2, 3], ['a', 'b', 'c']); //=> [f(1, 'a'), f(2, 'b'), f(3, 'c')]
    R.zipWith(f, [1, 2, 3])(['a', 'b', 'c']); //=> [f(1, 'a'), f(2, 'b'), f(3, 'c')]
}

/*****************************************************************
 * Object category
 */
() => {
    R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
    R.assoc('c')(3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
    R.assoc('c', 3)({a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
    // R.assoc(R.__, 3, {a: 1, b: 2})('c'); //=> {a: 1, b: 2, c: 3}
    // R.assoc('c', R.__, {a: 1, b: 2})(3); //=> {a: 1, b: 2, c: 3}
    // R.assoc('c', 3, R.__)({a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
    // R.assoc(R.__, 3, R.__)('c', {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
}

() => {
    R.dissoc('b', {a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
    R.dissoc('b')({a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
}

() => {
    R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
    R.assocPath(['a', 'b', 'c'])(42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
    R.assocPath(['a', 'b', 'c'], 42)({a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
}

() => {
    var objects = [{}, {}, {}];
    R.clone(objects);
    R.clone({});
    R.clone(10);
    R.clone('foo');
    R.clone(Date.now());
}

() => {
    var matchPhrases = R.compose(
      R.createMapEntry('must'),
      R.map(R.createMapEntry('match_phrase'))
    );
    matchPhrases(['foo', 'bar', 'baz']);

    R.createMapEntry(R.__, 2)('b');
}

() => {
    R.dissoc('b', {a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
    R.dissoc('b')({a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
    R.dissoc(R.__, {a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
}

() => {
    R.dissocPath(['a', 'b', 'c'], {a: {b: {c: 42}}}); //=> {a: {b: {}}}
    R.dissocPath(['a', 'b', 'c'])({a: {b: {c: 42}}}); //=> {a: {b: {}}}
}

() => {
    var o1 = { a: 1, b: 2, c: 3, d: 4 };
    var o2 = { a: 10, b: 20, c: 3, d: 40 };
    R.eqProps('a', o1, o2); //=> false
    R.eqProps('c', o1, o2); //=> true
    R.eqProps('c')(o1, o2); //=> true
    R.eqProps('c', o1)(o2); //=> true
}

() => {
    R.evolve({ elapsed: R.add(1), remaining: R.add(-1) }, { name: 'Tomato', elapsed: 100, remaining: 1400 });
     //=> { name: 'Tomato', elapsed: 101, remaining: 1399 }
}

() => {
    R.functions(R); // returns list of ramda's own function names
    R.functions(new F2()); //=> ["x"]
}

() => {
    R.functionsIn(R); // returns list of ramda's own and prototype function names
    R.functionsIn(new F2()); //=> ["x", "z"]
}

() => {
    var hasName = R.has('name');
    hasName({name: 'alice'});   //=> true
    hasName({name: 'bob'});     //=> true
    hasName({});                //=> false

    var point = {x: 0, y: 0};
    var pointHas = R.has(R.__, point);
    pointHas('x');  //=> true
    pointHas('y');  //=> true
    pointHas('z');  //=> false
}

class Rectangle {
    constructor(public width: number, public height: number) {
        this.width = width;
        this.height = height;
    }
    area() {
        return this.width * this.height;
    }
};
() => {

    var square = new Rectangle(2, 2);
    R.hasIn('width', square);  //=> true
    R.hasIn('area', square);  //=> true
    R.hasIn(R.__, square)('area');  //=> true
}

() => {
    var raceResultsByFirstName = {
      first: 'alice',
      second: 'jake',
      third: 'alice',
    };
    R.invert(raceResultsByFirstName);
    //=> { 'alice': ['first', 'third'], 'jake':['second'] }
}

() => {
    let raceResults0 = {
      first: 'alice',
      second: 'jake'
    };
    R.invertObj(raceResults0);
    //=> { 'alice': 'first', 'jake':'second' }

    // Alternatively:
    let raceResults1 = ['alice', 'jake'];
    R.invertObj(raceResults1);
    //=> { 'alice': '0', 'jake':'1' }
}

() => {
    R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
}

() => {
    var f = new F();
    R.keysIn(f); //=> ['x', 'y']
}

() => {
    var xLens = R.lens(R.prop('x'), R.assoc('x'));
    R.view(xLens, {x: 1, y: 2});            //=> 1
    R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
    R.set(xLens)(4, {x: 1, y: 2});          //=> {x: 4, y: 2}
    R.set(xLens, 4)({x: 1, y: 2});          //=> {x: 4, y: 2}
    R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
    R.over(xLens, R.negate)({x: 1, y: 2});  //=> {x: -1, y: 2}
    R.over(xLens)(R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
}
() => {
    var headLens = R.lensIndex(0);
    R.view(headLens, ['a', 'b', 'c']);            //=> 'a'
    R.set(headLens, 'x', ['a', 'b', 'c']);        //=> ['x', 'b', 'c']
    R.over(headLens, R.toUpper, ['a', 'b', 'c']); //=> ['A', 'b', 'c']
}
() => {
    var xLens = R.lensProp('x');
    R.view(xLens, {x: 1, y: 2});            //=> 1
    R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
    R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
}
() => {
}

() => {
    R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
}

() => {
    var f = new F();
    R.keysIn(f); //=> ['x', 'y']
}

() => {
    var headLens = R.lens(
      function get(arr: number[]) { return arr[0]; },
      function set(val: number, arr: number[]) { return [val].concat(arr.slice(1)); }
    );
    headLens([10, 20, 30, 40]); //=> 10
    headLens.set('mu', [10, 20, 30, 40]); //=> ['mu', 20, 30, 40]

    var phraseLens = R.lens(
      function get(obj: any) { return obj.phrase; },
      function set(val: string, obj: any) {
        var out = R.clone(obj);
        out.phrase = val;
        return out;
      }
    );
    var obj1 = { phrase: 'Absolute filth . . . and I LOVED it!'};
    var obj2 = { phrase: "What's all this, then?"};
    phraseLens(obj1); // => 'Absolute filth . . . and I LOVED it!'
    phraseLens(obj2); // => "What's all this, then?"
    phraseLens.set('Ooh Betty', obj1); //=> { phrase: 'Ooh Betty'}
}


() => {
    var phraseLens = R.lensProp('phrase');
    var obj1 = { phrase: 'Absolute filth . . . and I LOVED it!'};
    var obj2 = { phrase: "What's all this, then?"};
    phraseLens(obj1); // => 'Absolute filth . . . and I LOVED it!'
    phraseLens(obj2); // => "What's all this, then?"
    phraseLens.set('Ooh Betty', obj1); //=> { phrase: 'Ooh Betty'}
}

() => {
    var isPositive = function(n: number) {
        return n > 0;
    };
    R.pickBy(isPositive, {a: 1, b: 2, c: -1, d: 0, e: 5}); //=> {a: 1, b: 2, e: 5}
    var containsBackground = function(val: any) {
        return val.bgcolor;
    };
    var colors = {1: {color: 'read'}, 2: {color: 'black', bgcolor: 'yellow'}};
    R.pickBy(containsBackground, colors); //=> {2: {color: 'black', bgcolor: 'yellow'}}

    var isUpperCase = function(val: number, key: string) { return key.toUpperCase() === key; }
    R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
}

() => {
    var values = { x: 1, y: 2, z: 3 };
    var double = function(num: number) {
        return num * 2;
    };
    R.mapObj(double, values); //=> { x: 2, y: 4, z: 6 }
    R.mapObj(double)(values); //=> { x: 2, y: 4, z: 6 }
}

() => {
    R.pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
    R.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
    R.pick(['a', 'e', 'f'])({a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
}

() => {
    R.omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}
    R.omit(['a', 'd'])({a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}
}

() => {
    var headLens = R.lensIndex(0);
    R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
}

() => {
    R.pickAll(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
    R.pickAll(['a', 'd'])({a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
    R.pickAll(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, e: undefined, f: undefined}
    R.pickAll(['a', 'e', 'f'])({a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, e: undefined, f: undefined}
}

() => {
    var isUpperCase = function(val: number, key: string) { return key.toUpperCase() === key; }
    R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
}

() => {
    var abby = {name: 'Abby', age: 7, hair: 'blond', grade: 2};
    var fred = {name: 'Fred', age: 12, hair: 'brown', grade: 7};
    var kids = [abby, fred];
    R.project(['name', 'grade'], kids); //=> [{name: 'Abby', grade: 2}, {name: 'Fred', grade: 7}]
}

() => {
    var x: number = <number>R.prop('x', {x: 100}); //=> 100
    R.prop('x', {}); //=> undefined
}

() => {
    var alice = {
      name: 'ALICE',
      age: 101
    };
    var favorite = R.prop('favoriteLibrary');
    var favoriteWithDefault = R.propOr('Ramda', 'favoriteLibrary');

    favorite(alice);  //=> undefined
    favoriteWithDefault(alice);  //=> 'Ramda'
}

() => {
    R.props(['x', 'y'], {x: 1, y: 2}); //=> [1, 2]
    R.props(['c', 'a', 'b'], {b: 2, a: 1}); //=> [undefined, 1, 2]

    var fullName = R.compose(R.join(' '), R.props(['first', 'last']));
    fullName({last: 'Bullet-Tooth', age: 33, first: 'Tony'}); //=> 'Tony Bullet-Tooth'
}

() => {
    R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]
}

() => {
    var f = new F();
    R.toPairsIn(f); //=> [['x','X'], ['y','Y']]
}

() => {
    R.values({a: 1, b: 2, c: 3}); //=> [1, 2, 3]
}
() => {
    var f = new F();
    R.valuesIn(f); //=> ['X', 'Y']
}

() => {
    var spec = {x: 2};
    var x1: boolean = R.where(spec, {w: 10, x: 2, y: 300}); //=> true
    var x2: boolean = R.where(spec, {x: 1, y: 'moo', z: true}); //=> false
    var x3: boolean = R.where(spec)({w: 10, x: 2, y: 300}); //=> true
    var x4: boolean = R.where(spec)({x: 1, y: 'moo', z: true}); //=> false

    // There's no way to represent the below functionality in typescript
    // per http://stackoverflow.com/a/29803848/632495
    // will need a work around.

    var spec2 = {x: function(val: number, obj: any) { return  val + obj.y > 10; }};
    R.where(spec2, {x: 2, y: 7}); //=> false
    R.where(spec2, {x: 3, y: 8}); //=> true

    var xs = [{x: 2, y: 1}, {x: 10, y: 2}, {x: 8, y: 3}, {x: 10, y: 4}];
    R.filter(R.where({x: 10}), xs); // ==> [{x: 10, y: 2}, {x: 10, y: 4}]
    R.filter(R.where({x: 10}))(xs); // ==> [{x: 10, y: 2}, {x: 10, y: 4}]
}

() => {
    // pred :: Object -> Boolean
    var pred = R.whereEq({a: 1, b: 2});
    pred({a: 1});              //=> false
    pred({a: 1, b: 2});        //=> true
    pred({a: 1, b: 2, c: 3});  //=> true
    pred({a: 1, b: 1});        //=> false
    R.whereEq({a: 'one'}, {a: 'one'}); // => true
}
/*****************************************************************
 * Function category
 */
() => {
    var mapIndexed = R.addIndex(R.map);
    mapIndexed(function(val: string, idx: number) {return idx + '-' + val;}, ['f', 'o', 'o', 'b', 'a', 'r']);
    //=> ['0-f', '1-o', '2-o', '3-b', '4-a', '5-r']
    mapIndexed((rectangle: Rectangle, idx: number) => rectangle.area()*idx, [new Rectangle(1,2), new Rectangle(4,7)]);
}

() => {
    var t = R.always('Tee');
    const x: string = t(); //=> 'Tee'
}

() => {
    const x: number[] = R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
    const y: number[] = R.ap([R.multiply(2), R.add(3)])([1,2,3]); //=> [2, 4, 6, 4, 5, 6]
}

() => {
    var nums = [1, 2, 3, -99, 42, 6, 7];
    R.apply(Math.max, nums); //=> 42
    R.apply(Math.max)(nums); //=> 42
}

() => {
    var takesThreeArgs = function(a: number, b: number, c: number) {
        return [a, b, c];
    };
    takesThreeArgs.length; //=> 3
    takesThreeArgs(1, 2, 3); //=> [1, 2, 3]

    var takesTwoArgs = R.binary(takesThreeArgs);
    takesTwoArgs.length; //=> 2
    // Only 2 arguments are passed to the wrapped function
    takesTwoArgs(1, 2, 3); //=> [1, 2, undefined]
}

() => {
    var indentN = R.pipe(R.times(R.always(' ')),
         R.join(''),
         R.replace(/^(?!$)/gm)
    );

    var format = R.converge(R.call,
                            R.pipe(R.prop('indent'), indentN),
                            R.prop('value'));

    format({indent: 2, value: 'foo\nbar\nbaz\n'}); //=> '  foo\n  bar\n  baz\n'
}

() => {
    var cmp = R.comparator<{age:number}>(function(a, b) {
      return a.age < b.age;
    });
    var people = [
      {name: 'Agy', age:33}, {name: 'Bib', age: 15}, {name: 'Cari', age: 16}
    ];
    R.sort(cmp, people);
}

() => {
    var add = function(a: number, b: number) { return a + b; };
    var multiply = function(a: number, b: number) { return a * b; };
    var subtract = function(a: number, b: number) { return a - b; };

    //≅ multiply( add(1, 2), subtract(1, 2) );
    const x: number = R.converge(multiply, add, subtract)(1, 2); //=> -3

    var add3 = function(a: number, b: number, c: number) { return a + b + c; };
    const y: number = R.converge(add3, multiply, add, subtract)(1, 2); //=> 4
}

() => {
    const f0 = R.compose(Math.pow);
    const f1 = R.compose(R.negate, Math.pow);
    const f2 = R.compose(R.inc, R.negate, Math.pow);
    const f3 = R.compose(R.inc, R.inc, R.negate, Math.pow);
    const f4 = R.compose(R.inc, R.inc, R.inc, R.negate, Math.pow);
    const f5 = R.compose(R.inc, R.inc, R.inc, R.inc, R.negate, Math.pow);
    const x0: number = f0(3, 4); // -(3^4) + 1
    const x1: number = f1(3, 4); // -(3^4) + 1
    const x2: number = f2(3, 4); // -(3^4) + 1
    const x3: number = f3(3, 4); // -(3^4) + 1
    const x4: number = f4(3, 4); // -(3^4) + 1
    const x5: number = f5(3, 4); // -(3^4) + 1
}

() => {
    const fn = function(a: string, b: number, c: string) {
        return [a,b,c];
    }
    const gn = R.compose(R.length, fn);
    const x: number = gn('Hello', 4, "world");
}

(() => {
    var Circle = function(r: number) {
        this.r = r;
        this.colors = Array.prototype.slice.call(arguments, 1);
    };
    Circle.prototype.area = function() {return Math.PI * Math.pow(this.r, 2);};
    var circleN = R.constructN(2, Circle);
    var c1 = circleN(1, 'red');
    var circle = R.construct(Circle);
    var c1 = circle(1, 'red');
})();

/*****************************************************************
 * Relation category
 */

() => {
    var numbers = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];
    var letters = R.split('', 'abcABCaaaBBc');
    R.countBy(Math.floor)(numbers);    //=> {'1': 3, '2': 2, '3': 1}
    R.countBy(R.toLower)(letters);   //=> {'a': 5, 'b': 4, 'c': 3}
}

() => {
    R.difference([1,2,3,4], [7,6,5,4,3]); //=> [1,2]
    R.difference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5]
}

() => {
    function cmp(x: any, y: any) { return x.a === y.a; }
    var l1 = [{a: 1}, {a: 2}, {a: 3}];
    var l2 = [{a: 3}, {a: 4}];
    R.differenceWith(cmp, l1, l2); //=> [{a: 1}, {a: 2}]
}

() => {
    R.equals(1, 1); //=> true
    R.equals('2', '1'); //=> false
    R.equals([1, 2, 3], [1, 2, 3]); //=> true

    var a: any = {}; a.v = a;
    var b: any = {}; b.v = b;
    R.equals(a, b); //=> true
}

() => {
    var o = {};
    R.identical(o, o); //=> true
    R.identical(1, 1); //=> true
    R.identical('2', '1'); //=> false
    R.identical([], []); //=> false
    R.identical(0, -0); //=> false
    R.identical(NaN, NaN); //=> true
}

() => {
    R.path(['a', 'b'], {a: {b: 2}}); //=> 2
    R.path(['a', 'b'])({a: {b: 2}}); //=> 2
}

() => {
    var sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));
    var alice = {
      name: 'ALICE',
      age: 101
    };
    var bob = {
      name: 'Bob',
      age: -10
    };
    var clara = {
      name: 'clara',
      age: 314.159
    };
    var people = [clara, bob, alice];
    sortByNameCaseInsensitive(people); //=> [alice, bob, clara]
}

/*****************************************************************
 * Math category
 */
() => {
    R.add(2, 3);       //=>  5
    R.add(7)(10);      //=> 17
    R.add("Hello", " World");  //=>  "Hello World"
    R.add("Hello")(" World");  //=>  "Hello World"
}

() => {
    R.dec(42); //=> 41
}

() => {
    R.divide(71, 100); //=> 0.71

    var half = R.divide(R.__, 2);
    half(42); //=> 21

    var reciprocal = R.divide(1);
    reciprocal(4);   //=> 0.25
}

() => {
    R.gt(2, 6); //=> false
    R.gt(2, 0); //=> true
    R.gt(2, 2); //=> false
    R.gt(R.__, 2)(10); //=> true
    R.gt(2)(10); //=> false
}

() => {
    R.gte(2, 6); //=> false
    R.gte(2, 0); //=> true
    R.gte(2, 2); //=> false
    R.gte(R.__, 2)(10); //=> true
    R.gte(2)(10); //=> false
}

() => {
    R.isNaN(NaN);        //=> true
    R.isNaN(undefined);  //=> false
    R.isNaN({});         //=> false
}

() => {
    R.lt(2, 6); //=> true
    R.lt(2, 0); //=> false
    R.lt(2, 2); //=> false
    R.lt(5)(10); //=> true
    R.lt(R.__, 5)(10); //=> false // right-sectioned currying
}

() => {
    R.lte(2, 6); //=> true
    R.lte(2, 0); //=> false
    R.lte(2, 2); //=> true
    R.lte(R.__, 2)(1); //=> true
    R.lte(2)(10); //=> true
}

() => {
    R.mathMod(-17, 5);  //=> 3
    R.mathMod(17, 5);   //=> 2
    R.mathMod(17, -5);  //=> NaN
    R.mathMod(17, 0);   //=> NaN
    R.mathMod(17.2, 5); //=> NaN
    R.mathMod(17, 5.3); //=> NaN

    var clock = R.mathMod(R.__, 12);
    clock(15); //=> 3
    clock(24); //=> 0

    var seventeenMod = R.mathMod(17);
    seventeenMod(3);  //=> 2
}

() => {
    var hasName = R.has('name');
    hasName({name: 'alice'});   //=> true
    hasName({name: 'bob'});     //=> true
    hasName({});                //=> false

    var point = {x: 0, y: 0};
    var pointHas = R.has(R.__, point);
    pointHas('x');  //=> true
    pointHas('y');  //=> true
    pointHas('z');  //=> false
}

() => {
    let x: number = R.max(7, 3); //=> 7
}

() => {
    function cmp(obj: any) { return obj.x; }
    var a = {x: 1}, b = {x: 2}, c = {x: 3};
    R.maxBy(cmp, [a, b, c]); //=> {x: 3}
    R.maxBy(cmp)([a, b, c]); //=> {x: 3}
}

() => {
    let x: number = R.min(9, 3); //=> 3
}

() => {
    function cmp(obj: any) { return obj.x; }
    var a = {x: 1}, b = {x: 2}, c = {x: 3};
    R.minBy(cmp, [a, b, c]); //=> {x: 1}
    R.minBy(cmp)([a, b, c]); //=> {x: 1}
}

() => {
    R.modulo(17, 3); //=> 2
    // JS behavior:
    R.modulo(-17, 3); //=> -2
    R.modulo(17, -3); //=> 2

    var isOdd = R.modulo(R.__, 2);
    isOdd(42); //=> 0
    isOdd(21); //=> 1
}

() => {
    var double = R.multiply(2);
    var triple = R.multiply(3);
    double(3);       //=>  6
    triple(4);       //=> 12
    R.multiply(2, 5);  //=> 10
}

() => {
    R.negate(42); //=> -42
}

() => {
    R.product([2,4,6,8,100,1]); //=> 38400
}

() => {
    R.subtract(10, 8); //=> 2

    var minus5 = R.subtract(R.__, 5);
    minus5(17); //=> 12

    var complementaryAngle = R.subtract(90);
    complementaryAngle(30); //=> 60
    complementaryAngle(72); //=> 18
}

() => {
    R.sum([2,4,6,8,100,1]); //=> 121
}

/*****************************************************************
 * String category
 */
() => {
    R.substring(0, 4, '1234567');
    R.substringFrom(4, '1234567');
    R.substringTo(8, 'abcdefghijklm');
}

() => {
    R.replace('foo', 'bar', 'foo foo foo'); //=> 'bar foo foo'
    R.replace('foo', 'bar')('foo foo foo'); //=> 'bar foo foo'
    R.replace('foo')('bar')('foo foo foo'); //=> 'bar foo foo'
    R.replace(/foo/, 'bar', 'foo foo foo'); //=> 'bar foo foo'

    // Use the "g" (global) flag to replace all occurrences:
    R.replace(/foo/g, 'bar', 'foo foo foo'); //=> 'bar bar bar'
    R.replace(/foo/g, 'bar')('foo foo foo'); //=> 'bar bar bar'
    R.replace(/foo/g)('bar')('foo foo foo'); //=> 'bar bar bar'
}

() => {
    R.nthChar(2, 'Ramda'); //=> 'm'
    R.nthChar(-2, 'Ramda'); //=> 'd'
}

() => {
    R.nthCharCode(2, 'Ramda'); //=> 'm'.charCodeAt(0)
    R.nthCharCode(-2, 'Ramda'); //=> 'd'.charCodeAt(0)
}
/*****************************************************************
 * Is category
 */

() => {
    R.is(Object, {}); //=> true
    R.is(Object)({}); //=> true
    R.is(Number, 1); //=> true
    R.is(Number)(1); //=> true
    R.is(Object, 1); //=> false
    R.is(Object)(1); //=> false
    R.is(String, 's'); //=> true
    R.is(String)('s'); //=> true
    R.is(String, new String('')); //=> true
    R.is(String)(new String('')); //=> true
    R.is(Object, new String('')); //=> true
    R.is(Object)(new String('')); //=> true
    R.is(Object, 's'); //=> false
    R.is(Object)('s'); //=> false
    R.is(Number, {}); //=> false
    R.is(Number)({}); //=> false
}

/*****************************************************************
 * Logic category
 */
() => {
    var gt10 = function(x: number) { return x > 10; };
    var even = function(x: number) { return x % 2 === 0};
    var f = R.allPass([gt10, even]);
    f(11); //=> false
    f(12); //=> true
}

() => {
    R.and(false, true); //=> false
    R.and(0, []); //=> 0
    R.and(0)([]); //=> 0
    R.and(null, ''); //=> null
    var Why: any = (function(val: boolean) {
        var why: any;
        why.val = val;
        why.and = function(x: boolean) {
            return this.val && x;
        }
        return Why;
    })(true);
    var why = new Why(true);
    R.and(why, false); // false
}
() => {
    var gt10 = function(x: number) { return x > 10; };
    var even = function(x: number) { return x % 2 === 0};
    var f = R.anyPass([gt10, even]);
    f(11); //=> true
    f(8); //=> true
    f(9); //=> false
}

() => {
    var gt10 = function(x: number) { return x > 10; };
    var even = function(x: number) { return x % 2 === 0 };
    var f = R.both(gt10, even);
    var g = R.both(gt10)(even);
    f(100); //=> true
    f(101); //=> false
}
() => {
    var isEven = function(n: number) { return n % 2 === 0; };
    var isOdd = R.complement(isEven);
    isOdd(21); //=> true
    isOdd(42); //=> false
}
() => {
    var fn = R.cond([
      [R.eq(0),   R.always('water freezes at 0°C')],
      [R.eq(100), R.always('water boils at 100°C')],
      [R.T,       (temp: number) => `nothing special happens at ${temp}°C`]
    ]);
    fn(0); //=> 'water freezes at 0°C'
    fn(50); //=> 'nothing special happens at 50°C'
    fn(100); //=> 'water boils at 100°C'
}
() => {
    var defaultTo42 = R.defaultTo(42);
    defaultTo42(null);  //=> 42
    defaultTo42(undefined);  //=> 42
    defaultTo42('Ramda');  //=> 'Ramda'
}
() => {
    var gt10 = function(x: number) { return x > 10; };
    var even = function(x: number) { return x % 2 === 0 };
    var f = R.either(gt10, even);
    var g = R.either(gt10)(even);
    f(101); //=> true
    f(8); //=> true
}
() => {
    // Flatten all arrays in the list but leave other values alone.
    var flattenArrays = R.map(R.ifElse(Array.isArray, R.flatten, R.identity));

    flattenArrays([[0], [[10], [8]], 1234, {}]); //=> [[0], [10, 8], 1234, {}]
    flattenArrays([[[10], 123], [8, [10]], "hello"]); //=> [[10, 123], [8, 10], "hello"]
}
() => {
    R.isEmpty([1, 2, 3]); //=> false
    R.isEmpty([]); //=> true
    R.isEmpty(''); //=> true
    R.isEmpty(null); //=> false
}

() => {
    R.not(true); //=> false
    R.not(false); //=> true
    R.not(0); // => true
    R.not(1); // => false
}

class Why {
    val: boolean;
    constructor(val: boolean) {
        this.val = val;
    }
    or(x: boolean) {
        return this.val && x;
    }
}
() => {
    const x0: boolean = R.or(false, true); //=> false
    const x1: number|any[] = R.or(0, []); //=> []
    const x2: number|any[] = R.or(0)([]); //=> []
    const x3: string = R.or(null, ''); //=> ''

    var why = new Why(true);
    why.or(true)
    const x4: Why|boolean = R.or(why, false); // false
}
