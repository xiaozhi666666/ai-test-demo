/**
 * Test Runner Utility
 * 用于运行和验证 LeetCode 题目的测试用例
 */

interface TestCase<T, R> {
  input: T;
  expected: R;
  description?: string;
}

export class TestRunner<T, R> {
  private passed = 0;
  private failed = 0;
  private testCases: TestCase<T, R>[] = [];

  constructor(private solutionName: string) {}

  addTest(input: T, expected: R, description?: string): void {
    this.testCases.push({ input, expected, description });
  }

  run(solution: (input: T) => R): void {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${this.solutionName}`);
    console.log('='.repeat(60));

    this.testCases.forEach((testCase, index) => {
      const { input, expected, description } = testCase;

      try {
        const startTime = performance.now();
        const result = solution(input);
        const endTime = performance.now();
        const executionTime = (endTime - startTime).toFixed(3);

        const isPassed = this.deepEqual(result, expected);

        if (isPassed) {
          this.passed++;
          console.log(`\n✅ Test Case ${index + 1}: PASSED (${executionTime}ms)`);
        } else {
          this.failed++;
          console.log(`\n❌ Test Case ${index + 1}: FAILED`);
          console.log(`   Expected: ${JSON.stringify(expected)}`);
          console.log(`   Got:      ${JSON.stringify(result)}`);
        }

        if (description) {
          console.log(`   Description: ${description}`);
        }
        console.log(`   Input: ${JSON.stringify(input)}`);
      } catch (error) {
        this.failed++;
        console.log(`\n❌ Test Case ${index + 1}: ERROR`);
        console.log(`   ${error}`);
      }
    });

    this.printSummary();
  }

  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((val, idx) => this.deepEqual(val, b[idx]));
    }
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every(key => this.deepEqual(a[key], b[key]));
    }
    return false;
  }

  private printSummary(): void {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Summary: ${this.passed} passed, ${this.failed} failed`);
    console.log('='.repeat(60));

    if (this.failed === 0) {
      console.log('🎉 All tests passed!\n');
    } else {
      console.log('⚠️  Some tests failed. Please review.\n');
      process.exit(1);
    }
  }
}

/**
 * 性能测试工具
 */
export function measurePerformance<T, R>(
  fn: (input: T) => R,
  input: T,
  iterations = 1000
): { avgTime: number; minTime: number; maxTime: number } {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn(input);
    const end = performance.now();
    times.push(end - start);
  }

  const avgTime = times.reduce((a, b) => a + b, 0) / iterations;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  return { avgTime, minTime, maxTime };
}
