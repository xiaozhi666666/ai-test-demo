/**
 * LeetCode #1: Two Sum
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/two-sum/
 *
 * Description:
 * Given an array of integers nums and an integer target, return indices of the
 * two numbers such that they add up to target.
 *
 * Example:
 * Input: nums = [2,7,11,15], target = 9
 * Output: [0,1]
 * Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
 *
 * Constraints:
 * - 2 <= nums.length <= 10^4
 * - -10^9 <= nums[i] <= 10^9
 * - -10^9 <= target <= 10^9
 */

import { TestRunner } from '../utils/test-runner';

/**
 * Solution: Using Hash Map
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }

    map.set(nums[i], i);
  }

  return [];
}

// Test cases
if (require.main === module) {
  const runner = new TestRunner<{ nums: number[]; target: number }, number[]>(
    'Two Sum'
  );

  runner.addTest(
    { nums: [2, 7, 11, 15], target: 9 },
    [0, 1],
    'Basic case: target found at beginning'
  );

  runner.addTest(
    { nums: [3, 2, 4], target: 6 },
    [1, 2],
    'Target found at middle'
  );

  runner.addTest(
    { nums: [3, 3], target: 6 },
    [0, 1],
    'Duplicate numbers'
  );

  runner.run(({ nums, target }) => twoSum(nums, target));
}
