module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 타입은 아래 값만 허용 (feat, fix, docs, style, refactor, perf, test, chore)
    'type-enum': [
      2,
      'always',
      [
        'feat', // 신규 기능
        'fix', // 버그 수정
        'docs', // 문서 변경
        'style', // 코드 포맷팅, 세미콜론 누락 등 (기능 변경 없는 경우)
        'refactor', // 코드 리팩토링
        'perf', // 성능 개선
        'test', // 테스트 코드 추가/수정
        'chore', // 빌드 업무 수정, 패키지 매니저 설정 등
        'ci', // CI 설정 변경
        'build', // 빌드 관련 변경
        'revert', // 커밋 롤백
      ],
    ],

    // 제목은 소문자 시작 권장
    'subject-case': [1, 'never', ['start-case', 'pascal-case']],

    // 제목 최대 길이 제한 (72자 권장)
    'subject-max-length': [2, 'always', 72],

    // 제목 끝에 마침표(.) 금지
    'subject-full-stop': [2, 'never', '.'],

    // 본문 빈 줄 필요
    'body-leading-blank': [1, 'always'],

    // 본문 최대 길이 제한 (100자 권장)
    'body-max-line-length': [1, 'always', 100],

    // 커밋 메시지 헤더와 바디 사이에 빈 줄 강제
    'header-max-length': [2, 'always', 100],

    // 범위(scope)는 소문자, 알파벳, 숫자, 하이픈, 언더스코어만 허용
    'scope-case': [2, 'always', 'lower-case'],

    // 범위는 옵션이지만 있으면 형식 맞춰야 함
    'scope-empty': [2, 'never'],
  },
}
