import { ChevronLeft } from 'lucide-react'
import Button from '@/components/atoms/Button'

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col px-[144px] py-[44px] text-start">
      {/* 상단 헤더 */}
      <header className="mb-11 flex items-center justify-between">
        <div className="flex gap-4">
          <button type="button" className="flex items-center text-gray-900">
            <ChevronLeft className="h-9 w-9" />
          </button>
          <h1 className="text-s1-bold text-gray-900">이용약관</h1>
        </div>
        <Button>확인</Button>
      </header>

      {/* 본문 영역 */}
      <main className="flex flex-col gap-11 leading-relaxed text-gray-900">
        {/* 제1조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제1조 (목적)</h2>
          <p className="text-b5-medium">
            본 약관은 로컬잇(LocallIT, 이하 "회사")이 제공하는 지방 대학생 IT 활동 지원 플랫폼
            서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을
            규정함을 목적으로 합니다.
          </p>
        </section>

        {/* 제2조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제2조 (정의)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>"회사"라 함은 로컬잇(LocallIT) 서비스를 운영하는 사업자를 의미합니다.</li>
            <li>
              "서비스"라 함은 지방 대학생들의 IT 활동을 지원하기 위해 회사가 제공하는 다음의
              서비스를 의미합니다:
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>팀원 모집 및 매칭 서비스</li>
                <li>프로젝트 보드 제작 및 관리 기능</li>
                <li>온라인 회의 서비스(화상, 음성 통화)</li>
                <li>실시간 채팅 및 메시지 서비스</li>
                <li>프로젝트 진행 관리 및 협업 도구</li>
                <li>기타 IT 활동 지원을 위한 부가 서비스</li>
              </ul>
            </li>
            <li>
              "이용자"라 함은 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 지방 대학생을
              포함한 모든 사용자를 의미합니다.
            </li>
            <li>
              "회원"이라 함은 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를
              지속적으로 이용할 수 있는 자를 의미합니다.
            </li>
          </ol>
        </section>

        {/* 제3조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제3조 (약관의 효력 및 변경)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>본 약관은 서비스 화면에 게시하여 이용자에게 공지함으로써 효력을 발생합니다.</li>
            <li>
              회사는 약관의규제에관한법률, 정보통신망이용촉진및정보보호등에관한법률 등 관련법을
              위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
            </li>
            <li>
              회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스
              초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
            </li>
          </ol>
        </section>

        {/* 제4조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제4조 (서비스의 제공 및 변경)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>회사는 다음과 같은 서비스를 제공합니다:</li>
            <ul className="text-b5-medium mt-2 list-disc space-y-1 pl-5">
              <li>팀원 모집 및 프로젝트 관리 관련 매칭 서비스</li>
              <li>온라인 협업 및 소통 기능</li>
              <li>프로젝트 진행 관리 및 데이터 저장 기능</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
            <li>회사는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.</li>
            <li>
              서비스의 내용, 이용방법, 이용시간에 대하여 변경이 있는 경우에는 변경사유, 변경될
              서비스의 내용 및 제공일자를 그 변경 전 7일 이상 해당 서비스 상에 공지합니다.
            </li>
          </ol>
        </section>

        {/* 제5조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제5조 (서비스의 이용계약의 성립)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>
              이용계약은 이용자의 이용신청에 대한 회사의 승낙과 이용자의 약관 내용에 대한 동의로
              성립됩니다.
            </li>
            <li>
              회원가입 신청자 중 다음 각 호에 해당하는 경우 회사는 승낙을 하지 않거나 사후에
              이용계약을 해지할 수 있습니다:
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                <li>미성년자가 법정대리인의 동의를 얻지 아니한 경우</li>
                <li>
                  이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반하며
                  신청하는 경우
                </li>
              </ul>
            </li>
          </ol>
        </section>

        {/* 제6조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제6조 (회원정보의 변경)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>
              회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수
              있습니다.
            </li>
            <li>
              회원은 회원가입 시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 전자우편
              기타 방법으로 회사에 그 변경사항을 알려야 합니다.
            </li>
            <li>
              제2항의 변경사항을 회사에 알리지 않아 발생한 불이익에 대하여는 회원에게 책임이
              있습니다.
            </li>
          </ol>
        </section>

        {/* 제7조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제7조 (개인정보보호의 의무)</h2>
          <p className="text-b5-medium">
            회사는 정보통신망법 등 관계 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해
            노력합니다. 개인정보의 보호 및 사용에 대해서는 관련법 및 회사의 개인정보처리방침이
            적용됩니다.
          </p>
        </section>

        {/* 제8조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제8조 (회원의 의무)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>이용자는 다음 행위를 하여서는 안 됩니다:</li>
            <ul className="text-b5-medium mt-2 list-disc space-y-1 pl-5">
              <li>신청 또는 변경 시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>
                외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개
                또는 게시하는 행위
              </li>
              <li>프로젝트 팀 활동 중 무단 이탈이나 방해 행위</li>
              <li>온라인 회의 중 부적절한 언행이나 방해 행위</li>
            </ul>
          </ol>
        </section>

        {/* 제9조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제9조 (서비스 이용시간)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>
              서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간
              운영함을 원칙으로 합니다.
            </li>
            <li>
              회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 상당한
              이유가 있는 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.
            </li>
          </ol>
        </section>

        {/* 제10조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제10조 (서비스 이용료)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>회사가 제공하는 기본 서비스는 무료입니다.</li>
            <li>
              유료 서비스의 경우 해당 서비스의 이용조건과 요금을 명시하고 이용자의 동의를 받습니다.
            </li>
          </ol>
        </section>

        {/* 제11조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제11조 (저작권의 귀속 및 이용제한)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.</li>
            <li>
              이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의
              사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나
              제3자에게 이용하게 하여서는 안 됩니다.
            </li>
            <li>이용자가 서비스에 게시한 게시물에 대한 권리와 책임은 게시자에게 있습니다.</li>
          </ol>
        </section>

        {/* 제12조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제12조 (계약해지 및 이용제한)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>
              회원이 이용계약을 해지하고자 하는 때에는 회원 본인이 온라인을 통하여 회사에 해지신청을
              하여야 합니다.
            </li>
            <li>
              회사는 회원이 다음 각호의 사유에 해당하는 경우 사전통지 없이 이용계약을 해지하거나
              또는 기간을 정하여 서비스 이용을 중단할 수 있습니다:
            </li>
            <ul className="text-b5-medium mt-2 list-disc space-y-1 pl-5">
              <li>가입 신청 시에 허위 내용을 등록한 경우</li>
              <li>
                다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를
                위협하는 경우
              </li>
              <li>
                서비스를 이용하여 법령 또는 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우
              </li>
            </ul>
          </ol>
        </section>

        {/* 제13조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제13조 (손해배상)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>
              회사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가 발생하더라도 동 손해가
              회사의 고의 또는 중과실에 의한 경우를 제외하고 이에 대하여 책임을 부담하지 아니합니다.
            </li>
            <li>
              회사가 개별서비스 제공자와 제휴 계약을 체결하여 회원에게 개별서비스를 제공하는 경우에
              회원이 이들 개별서비스를 이용함으로써 손해가 발생한 경우 회사는 고의 또는 중과실이
              없는 한 이에 대하여 책임을 지지 않습니다.
            </li>
          </ol>
        </section>

        {/* 제14조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제14조 (면책조항)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>
              회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
              서비스 제공에 관한 책임이 면제됩니다.
            </li>
            <li>
              회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
            </li>
            <li>
              회사는 회원이 서비스에 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는
              책임을 지지 않습니다.
            </li>
          </ol>
        </section>

        {/* 제15조 */}
        <section>
          <h2 className="text-b3-bold mb-3">제15조 (재판권)</h2>
          <ol className="text-b5-medium list-decimal space-y-2 pl-5">
            <li>
              회사와 회원 간에 발생한 서비스 이용에 관한 분쟁에 대하여는 대한민국 법을 적용하며, 본
              분쟁으로 인한 소는 민사소송법상의 관할을 가지는 대한민국의 법원에 제기합니다.
            </li>
          </ol>
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
