import { ChevronLeft } from 'lucide-react'

import Button from '@/components/atoms/Button'

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col px-[144px] py-[44px] text-start">
      {/* 상단 헤더 */}
      <header className="mb-11 flex items-center justify-between">
        <div className="flex gap-4">
          <button type="button" className="flex items-center text-gray-900">
            <ChevronLeft className="h-9 w-9" />
          </button>
          <h1 className="text-s1-bold text-gray-900">개인정보 처리방침</h1>
        </div>
        <Button>확인</Button>
      </header>

      {/* 본문 영역 */}
      <main className="flex flex-col gap-11 leading-relaxed text-gray-900">
        <p>
          로컬잇(LocallIT, 이하 &quot;회사&quot;)은 「개인정보 보호법」 제30조에 따라 정보주체의
          개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여
          다음과 같이 개인정보처리방침을 수립·공개합니다.
        </p>

        {/* 제1조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제1조 (개인정보의 처리목적)</h2>
          <p className="text-b5-medium">
            회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적
            이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」
            제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>
              회원 가입 및 관리
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                <li>회원자격 유지·관리, 서비스 부정이용 방지</li>
                <li>각종 고지·통지, 고충처리 목적으로 개인정보를 처리합니다.</li>
              </ul>
            </li>
            <li>
              IT 프로젝트 팀 매칭 서비스 제공
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>팀원 모집 게시판 서비스 제공</li>
                <li>사용자 간 매칭 및 연결 서비스 제공</li>
                <li>프로젝트 참여 이력 관리</li>
              </ul>
            </li>
            <li>
              온라인 협업 서비스 제공
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>프로젝트 보드 관리 및 업무 분담 서비스</li>
                <li>온라인 회의 서비스 (화상, 음성 통화) 제공</li>
                <li>실시간 채팅 및 메시징 서비스 제공</li>
                <li>파일 공유 및 문서 협업 기능 제공</li>
              </ul>
            </li>
            <li>
              서비스 개선 및 맞춤형 서비스 제공
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>서비스 이용 통계 분석</li>
                <li>맞춤형 팀원 추천 서비스 제공</li>
                <li>서비스 품질 향상 및 개선</li>
              </ul>
            </li>
          </ol>
        </section>

        {/* 제2조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제2조 (개인정보의 처리 및 보유기간)</h2>
          <p className="text-b5-medium mb-2">
            ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
            동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
          </p>
          <p className="text-b5-medium mb-2">
            ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
          </p>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>
              회원 가입 및 관리
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>보유기간: 회원 탈퇴 후 즉시 삭제</li>
                <li>
                  예외: 관계법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료
                  시까지
                </li>
              </ul>
            </li>
            <li>
              프로젝트 참여 이력
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>보유기간: 회원 탈퇴 후 1년</li>
                <li>목적: 서비스 부정이용 방지 및 분쟁 해결</li>
              </ul>
            </li>
            <li>
              온라인 회의 기록
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>보유기간: 회의 종료 후 30일</li>
                <li>목적: 서비스 품질 개선 및 기술적 오류 해결</li>
              </ul>
            </li>
            <li>
              채팅 및 메시지 내역
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>보유기간: 발송일로부터 1년 또는 회원 탈퇴 시까지 중 빠른 시점</li>
                <li>예외: 사용자가 별도로 삭제 요청하는 경우 즉시 삭제</li>
              </ul>
            </li>
          </ol>
        </section>

        {/* 제3조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제3조 (개인정보의 처리항목)</h2>
          <p className="text-b5-medium mb-2">회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>필수항목</li>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>회원가입: 이름, 이메일 주소, 비밀번호, 학교명, 학과, 학년</li>
              <li>프로필 정보: 전공 분야, 관심 기술 스택, 프로젝트 경험</li>
              <li>서비스 이용: 접속 로그, 쿠키, 접속 IP 정보, 서비스 이용 기록</li>
            </ul>
            <li>선택항목</li>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>추가 프로필: 포트폴리오 링크, 자기소개, 프로필 사진</li>
              <li>연락처: 휴대전화번호 (팀 활동 시 필요에 따라)</li>
            </ul>
            <li>자동 수집 항목</li>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                서비스 이용과정에서 자동생성되는 정보: IP주소, 쿠키, MAC주소, 서비스 이용기록,
                방문기록, 불량 이용기록 등
              </li>
            </ul>
          </ol>
        </section>

        {/* 제4조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제4조 (개인정보의 제3자 제공)</h2>
          <ol className="text-b5-medium space-y-2">
            <li>
              ① 회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만
              처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조에 해당하는
              경우에만 개인정보를 제3자에게 제공합니다.
            </li>
            <li>② 회사는 다음과 같은 경우에 개인정보를 제3자에게 제공할 수 있습니다:</li>
            <ul className="text-b5-medium mt-2 list-disc space-y-1 pl-5">
              <li>프로젝트 팀 활동을 위해 팀원 간 연락처 공유 (사용자 동의 시)</li>
              <li>
                법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의
                요구가 있는 경우
              </li>
            </ul>
          </ol>
        </section>

        {/* 제5조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제5조 (개인정보처리 위탁)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>
              ① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고
              있습니다. 클라우드 서비스 제공업체에게는 서버 호스팅 및 데이터 보관 업무를, 이메일
              발송 서비스 업체에게는 회원가입, 비밀번호 재설정 등 이메일 발송 업무를 위탁하고
              있습니다.
            </li>
            <li>
              ② 회사는 위탁계약 체결시 「개인정보 보호법」 제26조에 따라 위탁업무 수행목적 외
              개인정보 처리금지, 기술적․관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리․감독,
              손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게
              처리하는지를 감독하고 있습니다.
            </li>
          </ol>
        </section>

        {/* 제6조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
          <ol className="text-b5-medium space-y-2">
            <li>
              ① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수
              있습니다.
            </li>
            <ol className="text-b5-medium mt-2 list-decimal space-y-1 pl-5">
              <li>개인정보 처리현황 통지요구</li>
              <li>개인정보 열람요구</li>
              <li>개인정보 정정·삭제요구</li>
              <li>개인정보 처리정지요구</li>
            </ol>
            <li>
              ② 제1항에 따른 권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조제1항에 따라
              서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이
              조치하겠습니다.
            </li>
            <li>
              ③ 정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정
              또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.
            </li>
          </ol>
        </section>

        {/* 제7조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제7조 (개인정보의 파기)</h2>
          <p className="text-b5-medium">
            ① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
            지체없이 해당 개인정보를 파기합니다.
          </p>
          <p className="text-b5-medium">② 개인정보 파기의 절차 및 방법은 다음과 같습니다.</p>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>
              파기절차: 회사는 파기 사유가 발생한 개인정보를 선정하고, 개인정보 보호책임자의 승인을
              받아 개인정보를 파기합니다.
            </li>

            <li>파기방법:</li>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
              <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
            </ul>
          </ol>
        </section>

        {/* 제8조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제8조 (개인정보의 안전성 확보조치)</h2>
          <p className="text-b5-medium">
            회사는 「개인정보 보호법」 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적
            및 물리적 조치를 하고 있습니다.
          </p>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>개인정보 취급 직원의 최소화 및 교육</li>
            <ul className="text-b5-medium mt-2 list-disc space-y-1 pl-5">
              <li>
                개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화하여 개인정보를 관리하는
                대책을 시행하고 있습니다.
              </li>
            </ul>
            <li>내부관리계획의 수립 및 시행</li>
            <ul className="text-b5-medium mt-2 list-disc space-y-1 pl-5">
              <li>개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다.</li>
            </ul>
            <li>해킹 등에 대비한 기술적 대책</li>
            <ul className="text-b5-medium mt-2 list-disc space-y-1 pl-5">
              <li>
                해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여
                보안프로그램을 설치하고 주기적인 갱신·점검을 하며, 외부로부터 접근이 통제된 구역에
                시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.
              </li>
            </ul>
            <li>개인정보의 암호화</li>
            <ul className="text-b5-medium mt-2 list-disc space-y-1 pl-5">
              <li>
                이용자의 개인정보는 비밀번호는 암호화되어 저장 및 관리되고 있어, 본인만이 알 수
                있으며 중요한 데이터는 파일 및 전송 데이터를 암호화하거나 파일 잠금 기능을 사용하는
                등의 별도 보안기능을 사용하고 있습니다.
              </li>
            </ul>
            <li>접속기록의 보관 및 위변조 방지</li>
            <ul className="text-b5-medium mt-2 list-disc space-y-1 pl-5">
              <li>
                개인정보처리시스템에 접속한 기록을 최소 1년 이상 보관, 관리하고 있으며, 접속 기록이
                위변조 및 도난, 분실되지 않도록 보안기능을 사용하고 있습니다.
              </li>
            </ul>
          </ol>
        </section>

        {/* 제9조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부)</h2>
          <ol className="text-b5-medium space-y-2">
            <li>
              ① 회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로
              불러오는 &apos;쿠키(cookie)&apos;를 사용합니다.
            </li>
            <li>
              ② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게
              보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.
            </li>
            <li>
              ③ 쿠키의 사용목적: 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태,
              인기 검색어, 보안접속 여부, 등을 파악하여 이용자에게 최적화된 정보 제공을 위해
              사용됩니다.
            </li>
            <li>
              ④ 쿠키의 설치·운영 및 거부: 웹브라우저 상단의 도구{'>'}인터넷 옵션{'>'}개인정보 메뉴의
              옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.
            </li>
            <li>⑤ 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</li>
          </ol>
        </section>

        {/* 제10조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제10조 (미성년자의 개인정보 보호)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>회사가 제공하는 기본 서비스는 무료입니다.</li>
            <li>
              유료 서비스의 경우 해당 서비스의 이용조건과 요금을 명시하고 이용자의 동의를 받습니다.
            </li>
          </ol>
        </section>

        {/* 제11조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제11조 (개인정보 보호책임자)</h2>
          <ol className="text-b5-medium space-y-2">
            <li>
              ① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
              정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고
              있습니다.
            </li>
            <li>▶ 개인정보 보호책임자</li>
            <ul className="text-b5-medium mt-2 list-disc space-y-1 pl-5">
              <li>성명: [담당자명]</li>
              <li>직책: [직책]</li>
              <li>연락처: [전화번호], [이메일], [팩스번호]</li>
            </ul>
            <li>▶ 개인정보 보호 담당부서</li>
            <ul className="text-b5-medium mt-2 list-disc space-y-1 pl-5">
              <li>부서명: [부서명]</li>
              <li>담당자: [담당자명]</li>
              <li>연락처: [전화번호], [이메일], [팩스번호]</li>
            </ul>
            <li>
              ② 정보주체께서는 회사의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호
              관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로
              문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체없이 답변 및 처리해드릴
              것입니다.
            </li>
          </ol>
        </section>

        {/* 제12조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제12조 (개인정보 처리방침 변경)</h2>
          <p className="text-b5-medium">
            ① 이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제
            및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
          </p>
        </section>

        {/* 부칙 */}
        <section>
          <h2 className="text-b3-bold mb-3">부칙</h2>
          <ol className="text-b5-medium space-y-1">
            <li>본 약관은 2025년 10월 10일부터 적용됩니다.</li>
            <li>로컬잇(LocallIT)</li>
            <li>연락처: locallit.team@gmail.com</li>
          </ol>
        </section>
      </main>
    </div>
  )
}
